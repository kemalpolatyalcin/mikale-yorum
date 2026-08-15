<?php
namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Review;
use App\Models\Waiter;
use App\Models\Question;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MainController extends Controller {
    public function index() {
        $reviews = Review::with('waiter')->latest()->take(10)->get();
        $waiters = Waiter::all();
        $questions = Question::where('is_active', true)->orderBy('sort_order', 'asc')->get();
        return view('main', compact('reviews', 'waiters', 'questions'));
    }

    public function adminLogin(Request $request) {
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        if ($validated['username'] === 'admin' && $validated['password'] === 'password123') {
            return response()->json([
                'success' => true,
                'token' => 'admin_authenticated_token_' . md5(time()),
                'user' => [
                    'name' => 'Restoran Yöneticisi',
                    'role' => 'admin'
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Kullanıcı adı veya şifre hatalı!'
        ], 401);
    }

    public function closeBill(Request $request) {
        $tableNo = $request->input('table_no') ?? $request->input('table_id') ?? $request->input('masa_id') ?? 1;
        $waiterId = $request->input('waiter_id') ?? $request->input('garson_id') ?? 1;
        $orderId = $request->input('order_id') ?? $request->input('siparis_id') ?? ('SIP-' . rand(1000, 9999));
        $items = $request->input('items', []);

        if (empty($items)) {
            $items = [
                ['name' => 'Şef Özel Yemeği', 'price' => 320, 'quantity' => 1],
                ['name' => 'İçecek', 'price' => 45, 'quantity' => 2]
            ];
        }

        $total = $request->input('total');
        if (!$total) {
            $total = collect($items)->sum(function($item) {
                return ($item['price'] ?? 0) * ($item['quantity'] ?? 1);
            });
        }

        $bill = Bill::create([
            'order_id' => $orderId,
            'table_no' => $tableNo,
            'waiter_id' => $waiterId,
            'items' => $items,
            'total' => $total,
            'status' => 'closed'
        ]);

        $bill->load('waiter');
        return response()->json($bill);
    }

    public function getBill($id) {
        $bill = Bill::with('waiter')->where('id', $id)->orWhere('order_id', $id)->firstOrFail();
        return response()->json($bill);
    }

    public function printBill($id) {
        $bill = Bill::with('waiter')->findOrFail($id);
        $bill->update(['status' => 'closed']);
        return response()->json($bill);
    }

    public function submitReview(Request $request) {
        $validated = $request->validate([
            'waiter_id' => 'required|exists:waiters,id',
            'bill_id' => 'nullable|exists:bills,id',
            'order_id' => 'nullable|string',
            'table_no' => 'nullable|integer',
            'food_stars' => 'nullable|integer|between:1,5',
            'food_comment' => 'nullable|string|max:500',
            'service_stars' => 'nullable|integer|between:1,5',
            'service_comment' => 'nullable|string|max:500',
            'atmosphere_stars' => 'nullable|integer|between:1,5',
            'atmosphere_comment' => 'nullable|string|max:500',
            'overall_stars' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
            'customer_name' => 'nullable|string|max:100'
        ]);

        if (empty($validated['customer_name'])) {
            $validated['customer_name'] = 'Misafir';
        }

        $validated['stars'] = $validated['overall_stars'];

        $review = Review::create($validated);
        $review->load('waiter');

        return response()->json([
            'success' => true,
            'review' => $review
        ]);
    }

    public function getReviews(Request $request) {
        $query = Review::with(['waiter', 'bill'])->latest();

        if ($request->filled('waiter_id')) {
            $query->where('waiter_id', $request->waiter_id);
        }

        if ($request->filled('table_no')) {
            $query->where('table_no', $request->table_no);
        }

        if ($request->filled('order_id')) {
            $query->where('order_id', 'like', '%' . $request->order_id . '%');
        }

        if ($request->filled('stars')) {
            $query->where('overall_stars', $request->stars);
        }

        if ($request->filled('month') && $request->filled('year')) {
            $query->whereMonth('created_at', $request->month)->whereYear('created_at', $request->year);
        }

        $reviews = $query->limit(50)->get();
        return response()->json($reviews);
    }

    public function getMonthlyEvaluation(Request $request) {
        $month = $request->input('month', Carbon::now()->month);
        $year = $request->input('year', Carbon::now()->year);

        $waiters = Waiter::all();
        $report = [];

        foreach ($waiters as $waiter) {
            $reviews = Review::where('waiter_id', $waiter->id)
                ->whereMonth('created_at', $month)
                ->whereYear('created_at', $year)
                ->get();

            $totalReviews = $reviews->count();

            if ($totalReviews > 0) {
                $avgFood = round($reviews->avg('food_stars') ?? 0, 1);
                $avgService = round($reviews->avg('service_stars') ?? 0, 1);
                $avgAtmosphere = round($reviews->avg('atmosphere_stars') ?? 0, 1);
                $avgOverall = round($reviews->avg('overall_stars') ?? 0, 1);

                $monthlyScore = round((($avgFood * 0.3) + ($avgService * 0.4) + ($avgAtmosphere * 0.3)) * 20, 1);
            } else {
                $avgFood = 0;
                $avgService = 0;
                $avgAtmosphere = 0;
                $avgOverall = 0;
                $monthlyScore = 0;
            }

            $report[] = [
                'waiter_id' => $waiter->id,
                'name' => $waiter->name,
                'photo' => $waiter->photo,
                'total_reviews' => $totalReviews,
                'avg_food' => $avgFood,
                'avg_service' => $avgService,
                'avg_atmosphere' => $avgAtmosphere,
                'avg_overall' => $avgOverall,
                'monthly_score' => $monthlyScore
            ];
        }

        usort($report, function($a, $b) {
            return $b['monthly_score'] <=> $a['monthly_score'];
        });

        return response()->json([
            'month' => (int)$month,
            'year' => (int)$year,
            'waiters' => $report
        ]);
    }

    public function getQuestions(Request $request) {
        $query = Question::orderBy('sort_order', 'asc');
        if ($request->has('active_only')) {
            $query->where('is_active', true);
        }
        $questions = $query->get();
        return response()->json($questions);
    }

    public function storeQuestion(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'category_name' => 'required|string|max:100',
            'icon_class' => 'nullable|string|max:100',
            'key_name' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean'
        ]);

        if (empty($validated['icon_class'])) {
            $validated['icon_class'] = 'fas fa-star';
        }
        if (empty($validated['key_name'])) {
            $validated['key_name'] = 'custom_' . time();
        }
        if (!isset($validated['sort_order'])) {
            $validated['sort_order'] = Question::max('sort_order') + 1;
        }

        $question = Question::create($validated);
        $question->update(['step_number' => $question->sort_order]);

        return response()->json([
            'success' => true,
            'question' => $question
        ]);
    }

    public function updateQuestion(Request $request, $id) {
        $question = Question::findOrFail($id);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'category_name' => 'required|string|max:100',
            'icon_class' => 'nullable|string|max:100',
            'key_name' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean'
        ]);

        $question->update($validated);

        return response()->json([
            'success' => true,
            'question' => $question
        ]);
    }

    public function deleteQuestion($id) {
        $question = Question::findOrFail($id);
        $question->delete();

        return response()->json([
            'success' => true
        ]);
    }
}
