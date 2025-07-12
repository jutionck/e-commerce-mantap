<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShippingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ProductController::class, 'index'])->name('home');

// Test login route - remove in production
Route::get('/test-login', function() {
    $user = App\Models\User::where('email', 'test@example.com')->first();
    if ($user) {
        Auth::login($user);
        return redirect('/')->with('success', 'Logged in as ' . $user->email);
    }
    return redirect('/')->with('error', 'Test user not found');
});
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

Route::get('cart', [CartController::class, 'index'])->name('cart.index');
Route::post('cart', [CartController::class, 'store'])->name('cart.store');
Route::patch('cart/{product}', [CartController::class, 'update'])->name('cart.update');
Route::delete('cart/{product}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::post('shipping-cost', [ShippingController::class, 'getShippingCost'])->name('shipping.cost');

// Payment webhook (no auth required for Midtrans notification)
Route::post('payments/notification', [PaymentController::class, 'notification'])->name('payments.notification');

// Payment redirect routes (no auth required as they come from external payment provider)
Route::get('payments/success', [PaymentController::class, 'success'])->name('payments.success');
Route::get('payments/pending', [PaymentController::class, 'pending'])->name('payments.pending');
Route::get('payments/failed', [PaymentController::class, 'failed'])->name('payments.failed');

Route::middleware('auth')->group(function () {
    Route::get('checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    // Payment routes
    Route::get('payments/{order}', [PaymentController::class, 'index'])->name('payments.index');
    Route::post('payments/{payment}/cancel', [PaymentController::class, 'cancel'])->name('payments.cancel');
    Route::get('payments/{order}/check-status', [PaymentController::class, 'checkStatus'])->name('payments.check-status');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
