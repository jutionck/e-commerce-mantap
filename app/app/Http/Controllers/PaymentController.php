<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    /**
     * Show payment page
     */
    public function index(Order $order)
    {
        // Ensure user owns this order
        if ($order->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to payment');
        }

        // Check if order is in correct status
        if (!in_array($order->status, ['pending', 'pending_payment'])) {
            return redirect()->route('orders.show', $order)
                ->with('error', 'Order is not eligible for payment');
        }

        // Check if payment already exists and is paid
        $existingPayment = Payment::where('order_id', $order->id)
            ->where('status', 'paid')
            ->first();

        if ($existingPayment) {
            return redirect()->route('orders.show', $order)
                ->with('success', 'Order has already been paid');
        }

        try {
            // Create or get existing payment token
            $existingPayment = Payment::where('order_id', $order->id)
                ->where('status', 'pending')
                ->first();

            if ($existingPayment && $existingPayment->snap_token) {
                $paymentData = [
                    'snap_token' => $existingPayment->snap_token,
                    'payment_id' => $existingPayment->id,
                    'client_key' => config('midtrans.client_key'),
                    'environment' => config('midtrans.environment'),
                ];
            } else {
                // Create new Snap token
                $paymentData = $this->midtransService->createSnapToken($order);
            }

            return Inertia::render('Payment/Index', [
                'order' => $order->load('orderItems.product'),
                'paymentData' => $paymentData,
                'snapUrl' => config('midtrans.urls.' . config('midtrans.environment') . '.snap'),
            ]);

        } catch (\Exception $e) {
            Log::error('Payment page error', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('orders.show', $order)
                ->with('error', 'Failed to initialize payment: ' . $e->getMessage());
        }
    }

    /**
     * Handle Midtrans webhook notification
     */
    public function notification(Request $request)
    {
        try {
            $notification = $request->all();
            
            Log::info('Received payment notification', $notification);

            $result = $this->midtransService->handleNotification($notification);

            if ($result) {
                return response()->json(['status' => 'success']);
            } else {
                return response()->json(['status' => 'error'], 400);
            }

        } catch (\Exception $e) {
            Log::error('Payment notification error', [
                'error' => $e->getMessage(),
                'notification' => $request->all(),
            ]);

            return response()->json(['status' => 'error'], 500);
        }
    }

    /**
     * Handle successful payment redirect
     */
    public function success(Request $request)
    {
        $orderId = $request->get('order_id');
        
        if (!$orderId) {
            return redirect()->route('orders.index')
                ->with('error', 'Payment order not found');
        }

        try {
            // Verify payment status from Midtrans
            $paymentStatus = $this->midtransService->verifyPayment($orderId);
            
            $order = Order::where('order_number', $orderId)->first();
            
            if (!$order) {
                return redirect()->route('orders.index')
                    ->with('error', 'Order not found');
            }

            // Ensure user owns this order
            if ($order->user_id !== auth()->id()) {
                abort(403, 'Unauthorized access to order');
            }

            return Inertia::render('Payment/Success', [
                'order' => $order->load('orderItems.product'),
                'paymentStatus' => $paymentStatus,
            ]);

        } catch (\Exception $e) {
            Log::error('Payment success page error', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('orders.index')
                ->with('error', 'Failed to verify payment status');
        }
    }

    /**
     * Handle pending payment redirect
     */
    public function pending(Request $request)
    {
        $orderId = $request->get('order_id');
        
        if (!$orderId) {
            return redirect()->route('orders.index')
                ->with('warning', 'Payment is pending');
        }

        $order = Order::where('order_number', $orderId)->first();
        
        if (!$order) {
            return redirect()->route('orders.index')
                ->with('error', 'Order not found');
        }

        // Ensure user owns this order
        if ($order->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to order');
        }

        return Inertia::render('Payment/Pending', [
            'order' => $order->load('orderItems.product'),
        ]);
    }

    /**
     * Handle failed payment redirect
     */
    public function failed(Request $request)
    {
        $orderId = $request->get('order_id');
        
        if (!$orderId) {
            return redirect()->route('orders.index')
                ->with('error', 'Payment failed');
        }

        $order = Order::where('order_number', $orderId)->first();
        
        if (!$order) {
            return redirect()->route('orders.index')
                ->with('error', 'Order not found');
        }

        // Ensure user owns this order
        if ($order->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to order');
        }

        return Inertia::render('Payment/Failed', [
            'order' => $order->load('orderItems.product'),
        ]);
    }

    /**
     * Cancel payment
     */
    public function cancel(Payment $payment)
    {
        $order = $payment->order;

        // Ensure user owns this order
        if ($order->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to payment');
        }

        try {
            // Cancel payment in Midtrans
            $result = $this->midtransService->cancelPayment($order->order_number);

            if ($result) {
                // Update payment and order status
                $payment->update(['status' => 'cancelled']);
                $order->update(['status' => 'cancelled']);

                return redirect()->route('orders.show', $order)
                    ->with('success', 'Payment has been cancelled');
            } else {
                return redirect()->route('orders.show', $order)
                    ->with('error', 'Failed to cancel payment');
            }

        } catch (\Exception $e) {
            Log::error('Payment cancellation error', [
                'payment_id' => $payment->id,
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('orders.show', $order)
                ->with('error', 'Failed to cancel payment: ' . $e->getMessage());
        }
    }

    /**
     * Check payment status via AJAX
     */
    public function checkStatus(Order $order)
    {
        // Ensure user owns this order
        if ($order->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $paymentStatus = $this->midtransService->verifyPayment($order->order_number);
            
            return response()->json([
                'status' => 'success',
                'payment_status' => $paymentStatus,
                'order_status' => $order->fresh()->status,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
