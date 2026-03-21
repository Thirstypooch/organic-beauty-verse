<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user', [AuthController::class, 'updateProfile']);

    // Order routes
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    // Payment routes
    Route::post('/orders/{order}/payment', [PaymentController::class, 'createPreference']);
});

// MercadoPago webhook — no auth (called by MercadoPago directly)
Route::post('/webhooks/mercadopago', [PaymentController::class, 'webhook']);

// Product catalog routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{product}', [ProductController::class, 'show'])->where('product', '[0-9]+');
Route::get('/products/{categoryName}', [ProductController::class, 'byCategory'])->where('categoryName', '[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+');
