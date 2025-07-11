<?php

use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "admin" middleware group.
|
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Admin Dashboard
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    // Product Management
    Route::resource('products', \App\Http\Controllers\Admin\ProductController::class);

    // Product Image Management
    Route::post('products/{product}/images', [\App\Http\Controllers\Admin\ProductImageController::class, 'store'])->name('products.images.store');
    Route::delete('product-images/{image}', [\App\Http\Controllers\Admin\ProductImageController::class, 'destroy'])->name('products.images.destroy');
    Route::patch('product-images/{image}/primary', [\App\Http\Controllers\Admin\ProductImageController::class, 'setPrimary'])->name('products.images.setPrimary');
    Route::patch('products/{product}/images/reorder', [\App\Http\Controllers\Admin\ProductImageController::class, 'reorder'])->name('products.images.reorder');

    // Category Management
    Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class);

    // Order Management
    Route::get('orders/export', [\App\Http\Controllers\Admin\OrderController::class, 'export'])->name('orders.export');
    Route::patch('orders/{order}/status', [\App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.updateStatus');
    Route::resource('orders', \App\Http\Controllers\Admin\OrderController::class)->only(['index', 'show']);

    // User Management
    Route::post('users/{user}/toggle-status', [\App\Http\Controllers\Admin\UserController::class, 'toggleStatus'])->name('users.toggle-status');
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
});
