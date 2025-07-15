<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        Log::info('Payment page accessed', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'user_id' => Auth::id(),
            'order_user_id' => $order->user_id
        ]);

        if (! Auth::check() || $order->user_id !== Auth::id()) {
            Log::error('Unauthorized payment access', [
                'order_id' => $order->id,
                'current_user_id' => Auth::id(),
                'order_user_id' => $order->user_id
            ]);
            abort(403, 'Unauthorized access to payment');
        }

        // Check if order is in correct status
        if (! in_array($order->status, ['pending', 'pending_payment'])) {
            return redirect()->route('orders.show', $order)
                ->with('error', 'Order is not eligible for payment');
        }

        // Check if payment has expired
        if ($order->isPaymentExpired()) {
            Log::info('Payment access attempt for expired order', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'created_at' => $order->created_at,
                'expires_at' => $order->getPaymentExpiryTime()
            ]);
            
            return redirect()->route('orders.show', $order)
                ->with('error', 'Waktu pembayaran untuk pesanan ini telah berakhir. Silakan buat pesanan baru.');
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
                'snapUrl' => config('midtrans.urls.'.config('midtrans.environment').'.snap'),
            ]);
        } catch (\Exception $e) {
            Log::error('Payment page error', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('orders.show', $order)
                ->with('error', 'Failed to initialize payment: '.$e->getMessage());
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

        if (! $orderId) {
            return redirect()->route('orders.index')
                ->with('error', 'Payment order not found');
        }

        try {
            // Verify payment status from Midtrans
            $paymentStatus = $this->midtransService->verifyPayment($orderId);

            $order = Order::where('order_number', $orderId)->first();

            if (! $order) {
                return redirect()->route('orders.index')
                    ->with('error', 'Order not found');
            }

            // Ensure user owns this order
            if ($order->user_id !== Auth::id()) {
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

        if (! $orderId) {
            return redirect()->route('orders.index')
                ->with('warning', 'Payment is pending');
        }

        $order = Order::where('order_number', $orderId)->first();

        if (! $order) {
            return redirect()->route('orders.index')
                ->with('error', 'Order not found');
        }

        // Ensure user owns this order
        if ($order->user_id !== Auth::id()) {
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

        if (! $orderId) {
            return redirect()->route('orders.index')
                ->with('error', 'Payment failed');
        }

        $order = Order::where('order_number', $orderId)->first();

        if (! $order) {
            return redirect()->route('orders.index')
                ->with('error', 'Order not found');
        }

        // Ensure user owns this order
        if ($order->user_id !== Auth::id()) {
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
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to order');
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
                ->with('error', 'Failed to cancel payment: '.$e->getMessage());
        }
    }

    /**
     * Check payment status via AJAX
     */
    public function checkStatus(Order $order)
    {
        // Ensure user owns this order
        if ($order->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $paymentStatus = $this->midtransService->verifyPayment($order->order_number);

            // Convert to array if it's an object
            $paymentData = is_object($paymentStatus) ? json_decode(json_encode($paymentStatus), true) : $paymentStatus;

            // Auto-update order status based on payment status
            if (isset($paymentData['transaction_status'])) {
                $transactionStatus = $paymentData['transaction_status'];

                if ($transactionStatus === 'settlement' || $transactionStatus === 'capture') {
                    // Payment successful - update order and payment status
                    $order->update(['status' => 'paid']);

                    $payment = $order->payment;
                    if ($payment) {
                        // Extract bank info from VA numbers or payment type
                        $bankInfo = '';

                        if (isset($paymentData['va_numbers']) && ! empty($paymentData['va_numbers'])) {
                            $vaNumber = $paymentData['va_numbers'][0];
                            $vaNumber = is_object($vaNumber) ? json_decode(json_encode($vaNumber), true) : $vaNumber;
                            $bankInfo = strtoupper($vaNumber['bank']).' Virtual Account';
                        } elseif (isset($paymentData['payment_type'])) {
                            $paymentType = $paymentData['payment_type'];
                            switch ($paymentType) {
                                case 'bank_transfer':
                                    $bankInfo = 'Bank Transfer';
                                    break;
                                case 'echannel':
                                    $bankInfo = 'Mandiri Bill Payment';
                                    break;
                                case 'gopay':
                                    $bankInfo = 'GoPay';
                                    break;
                                case 'qris':
                                    $bankInfo = 'QRIS';
                                    break;
                                case 'shopeepay':
                                    $bankInfo = 'ShopeePay';
                                    break;
                                case 'dana':
                                    $bankInfo = 'DANA';
                                    break;
                                case 'linkaja':
                                    $bankInfo = 'LinkAja';
                                    break;
                                case 'ovo':
                                    $bankInfo = 'OVO';
                                    break;
                                case 'credit_card':
                                    $bankInfo = 'Credit Card';
                                    break;
                                case 'cstore':
                                    $bankInfo = 'Convenience Store';
                                    break;
                                case 'akulaku':
                                    $bankInfo = 'Akulaku';
                                    break;
                                default:
                                    $bankInfo = ucwords(str_replace('_', ' ', $paymentType));
                            }
                        }

                        $payment->update([
                            'status' => 'paid',
                            'transaction_id' => $paymentData['transaction_id'] ?? null,
                            'payment_type' => $paymentData['payment_type'] ?? null,
                            'payment_method' => $bankInfo ?: 'Midtrans Snap',
                            'settlement_time' => isset($paymentData['settlement_time']) ?
                                date('Y-m-d H:i:s', strtotime($paymentData['settlement_time'])) : now(),
                        ]);
                    }
                } elseif ($transactionStatus === 'pending') {
                    // Payment pending
                    $order->update(['status' => 'pending_payment']);

                    $payment = $order->payment;
                    if ($payment) {
                        $payment->update(['status' => 'pending']);
                    }
                } elseif (in_array($transactionStatus, ['deny', 'cancel', 'expire', 'failure'])) {
                    // Payment failed
                    $order->update(['status' => 'cancelled']);

                    $payment = $order->payment;
                    if ($payment) {
                        $payment->update(['status' => 'failed']);
                    }
                }
            }

            return response()->json([
                'status' => 'success',
                'payment_status' => $paymentStatus,
                'order_status' => $order->fresh()->status,
            ]);
        } catch (\Exception $e) {
            // Don't log 404 errors as they are expected for new transactions
            if (! str_contains($e->getMessage(), 'Transaction doesn\'t exist')) {
                Log::error('Failed to verify payment status', [
                    'order_id' => $order->order_number,
                    'error' => $e->getMessage(),
                ]);
            }

            return response()->json([
                'status' => 'pending',
                'message' => 'Payment not yet processed',
            ], 200);
        }
    }
}
