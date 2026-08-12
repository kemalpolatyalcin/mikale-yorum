<?php
namespace App\Http\Controllers;
use App\Models\Bill;
use App\Models\Review;
use App\Models\Waiter;
use Illuminate\Http\Request;
class MainController extends Controller {
    public function index() {
        $reviews = Review::with('waiter')->latest()->take(5)->get();
        $waiters = Waiter::all();
        return view('main', compact('reviews', 'waiters'));
    }
    public function closeBill(Request $request) {
        $validated = $request->validate([
            'table_no' => 'required|integer',
            'waiter_id' => 'required|exists:waiters,id',
            'items' => 'required|array',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.quantity' => 'required|integer'
        ]);
        $total = collect($validated['items'])->sum(function($item) {
            return $item['price'] * $item['quantity'];
        });
        $bill = Bill::create([
            'table_no' => $validated['table_no'],
            'waiter_id' => $validated['waiter_id'],
            'items' => $validated['items'],
            'total' => $total,
            'status' => 'open'
        ]);
        $bill->load('waiter');
        return response()->json($bill);
    }
    public function getBill($id) {
        $bill = Bill::with('waiter')->findOrFail($id);
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
            'stars' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:500',
            'customer_name' => 'nullable|string|max:100',
            'bill_id' => 'nullable|exists:bills,id'
        ]);
        $review = Review::create($validated);
        $waiter = Waiter::find($validated['waiter_id']);
        return response()->json([
            'review' => $review,
            'average_rating' => $waiter->average_rating
        ]);
    }
    public function getReviews(Request $request) {
        $query = Review::with('waiter')->latest();
        if ($request->has('waiter_id')) {
            $query->where('waiter_id', $request->waiter_id);
        }
        $reviews = $query->limit(10)->get();
        return response()->json($reviews);
    }
}
