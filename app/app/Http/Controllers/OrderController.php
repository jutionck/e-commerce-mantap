<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = auth()->user()->orders()
            ->with(['orderItems.product'])
            ->latest()
            ->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        // Ensure user can only view their own orders
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['orderItems.product', 'payment']);

        // Add payment expiry information
        $paymentExpiry = [
            'is_expired' => $order->isPaymentExpired(),
            'expires_at' => $order->getPaymentExpiryTime(),
            'time_remaining_minutes' => $order->getPaymentTimeRemaining(),
        ];

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'paymentExpiry' => $paymentExpiry,
        ]);
    }
}
