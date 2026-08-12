<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MainController;
Route::get('/', [MainController::class, 'index']);
Route::post('/api/bill/close', [MainController::class, 'closeBill']);
Route::get('/api/bill/{id}', [MainController::class, 'getBill']);
Route::put('/api/bill/{id}/print', [MainController::class, 'printBill']);
Route::post('/api/review', [MainController::class, 'submitReview']);
Route::get('/api/reviews', [MainController::class, 'getReviews']);
