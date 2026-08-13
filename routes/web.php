<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MainController;

Route::get('/', [MainController::class, 'index']);
Route::get('/login', [MainController::class, 'index']);
Route::get('/admin', [MainController::class, 'index']);

Route::post('/api/admin/login', [MainController::class, 'adminLogin']);
Route::post('/api/bill/close', [MainController::class, 'closeBill']);
Route::post('/api/bill/desktop-sync', [MainController::class, 'closeBill']);
Route::get('/api/bill/{id}', [MainController::class, 'getBill']);
Route::put('/api/bill/{id}/print', [MainController::class, 'printBill']);
Route::post('/api/review', [MainController::class, 'submitReview']);
Route::get('/api/reviews', [MainController::class, 'getReviews']);
Route::get('/api/admin/monthly-evaluation', [MainController::class, 'getMonthlyEvaluation']);
