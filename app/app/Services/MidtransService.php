<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;
use Exception;

class MidtransService
{
    public function __construct()
    {
        // Set Midtrans configuration
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.environment') === 'production';
        Config::$isSanitized = config('midtrans.sanitized');
        Config::$is3ds = config('midtrans.3ds');
    }

    /**
     * Create Snap payment token
     */
    public function createSnapToken(Order $order): array
    {
        try {
            // Prepare transaction details
            $transactionDetails = [
                'order_id' => $order->order_number,
                'gross_amount' => (int) $order->total_amount,
            ];

            // Prepare item details
            $itemDetails = [];
            foreach ($order->orderItems as $item) {
                $itemDetails[] = [
                    'id' => $item->product_id,
                    'price' => (int) $item->price,
                    'quantity' => $item->quantity,
                    'name' => $item->product->name,
                ];
            }

            // Add shipping cost as item
            if ($order->shipping_cost > 0) {
                $itemDetails[] = [
                    'id' => 'SHIPPING',
                    'price' => (int) $order->shipping_cost,
                    'quantity' => 1,
                    'name' => 'Shipping Cost - ' . $order->shipping_method,
                ];
            }

            // Prepare customer details
            $customerDetails = [
                'first_name' => $order->shipping_address['name'] ?? $order->user->name,
                'email' => $order->user->email,
                'phone' => $order->shipping_address['phone'] ?? '',
                'billing_address' => [
                    'first_name' => $order->shipping_address['name'] ?? $order->user->name,
                    'address' => $order->shipping_address['address'] ?? '',
                    'city' => $order->shipping_address['city'] ?? '',
                    'postal_code' => $order->shipping_address['postal_code'] ?? '',
                    'country_code' => 'IDN',
                ],
                'shipping_address' => [
                    'first_name' => $order->shipping_address['name'] ?? $order->user->name,
                    'address' => $order->shipping_address['address'] ?? '',
                    'city' => $order->shipping_address['city'] ?? '',
                    'postal_code' => $order->shipping_address['postal_code'] ?? '',
                    'country_code' => 'IDN',
                ],
            ];

            // Prepare transaction parameters
            $transactionParams = [
                'transaction_details' => $transactionDetails,
                'item_details' => $itemDetails,
                'customer_details' => $customerDetails,
                'enabled_payments' => config('midtrans.enabled_payments'),
                'expiry' => [
                    'start_time' => date('Y-m-d H:i:s O'),
                    'unit' => 'hour',
                    'duration' => config('midtrans.payment_timeout', 24),
                ],
                'callbacks' => [
                    'finish' => route('payments.success'),
                    'unfinish' => route('payments.pending'),
                    'error' => route('payments.failed'),
                ],
            ];

            // Log the transaction params for debugging
            Log::info('Creating Snap token with params', [
                'enabled_payments' => $transactionParams['enabled_payments'],
                'order_id' => $order->order_number,
            ]);
            
            // Create Snap token
            $snapToken = Snap::getSnapToken($transactionParams);

            // Create payment record
            $payment = Payment::create([
                'order_id' => $order->id,
                'transaction_id' => $order->order_number,
                'payment_method' => 'midtrans_snap',
                'amount' => $order->total_amount,
                'status' => 'pending',
                'snap_token' => $snapToken,
                'transaction_type' => 'snap',
                'gross_amount' => $order->total_amount,
            ]);

            Log::info('Snap token created successfully', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'amount' => $order->total_amount,
            ]);

            return [
                'snap_token' => $snapToken,
                'payment_id' => $payment->id,
                'client_key' => config('midtrans.client_key'),
                'environment' => config('midtrans.environment'),
            ];

        } catch (Exception $e) {
            Log::error('Failed to create Snap token', [
                'order_id' => $order->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw new Exception('Failed to create payment token: ' . $e->getMessage());
        }
    }

    /**
     * Verify payment status from Midtrans
     */
    public function verifyPayment(string $orderId): array
    {
        try {
            $status = Transaction::status($orderId);
            
            Log::info('Payment status retrieved', [
                'order_id' => $orderId,
                'status' => $status,
            ]);

            return (array) $status;

        } catch (Exception $e) {
            Log::error('Failed to verify payment status', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);

            throw new Exception('Failed to verify payment: ' . $e->getMessage());
        }
    }

    /**
     * Handle payment notification from Midtrans webhook
     */
    public function handleNotification(array $notification): bool
    {
        try {
            $orderId = $notification['order_id'] ?? null;
            $transactionStatus = $notification['transaction_status'] ?? null;
            $fraudStatus = $notification['fraud_status'] ?? null;
            $paymentType = $notification['payment_type'] ?? null;
            $grossAmount = $notification['gross_amount'] ?? null;

            Log::info('Processing payment notification', [
                'order_id' => $orderId,
                'transaction_status' => $transactionStatus,
                'fraud_status' => $fraudStatus,
                'payment_type' => $paymentType,
            ]);

            // Find order and payment
            $order = Order::where('order_number', $orderId)->first();
            if (!$order) {
                Log::warning('Order not found for notification', ['order_id' => $orderId]);
                return false;
            }

            $payment = Payment::where('order_id', $order->id)->first();
            if (!$payment) {
                Log::warning('Payment not found for order', ['order_id' => $orderId]);
                return false;
            }

            // Verify signature (for security)
            $signatureKey = hash('sha512', 
                $orderId . $notification['status_code'] . $grossAmount . config('midtrans.server_key')
            );

            if ($signatureKey !== ($notification['signature_key'] ?? '')) {
                Log::error('Invalid signature for payment notification', [
                    'order_id' => $orderId,
                    'expected' => $signatureKey,
                    'received' => $notification['signature_key'] ?? '',
                ]);
                return false;
            }

            // Update payment status based on transaction status
            $this->updatePaymentStatus($payment, $order, $transactionStatus, $fraudStatus, $paymentType, $notification);

            return true;

        } catch (Exception $e) {
            Log::error('Failed to handle payment notification', [
                'notification' => $notification,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return false;
        }
    }

    /**
     * Update payment and order status based on transaction status
     */
    private function updatePaymentStatus(Payment $payment, Order $order, string $transactionStatus, ?string $fraudStatus, string $paymentType, array $notification): void
    {
        $paymentStatus = 'pending';
        $orderStatus = $order->status;

        switch ($transactionStatus) {
            case 'capture':
                if ($fraudStatus === 'challenge') {
                    $paymentStatus = 'challenge';
                    $orderStatus = 'pending_verification';
                } else if ($fraudStatus === 'accept') {
                    $paymentStatus = 'paid';
                    $orderStatus = 'paid';
                }
                break;

            case 'settlement':
                $paymentStatus = 'paid';
                $orderStatus = 'paid';
                break;

            case 'pending':
                $paymentStatus = 'pending';
                $orderStatus = 'pending_payment';
                break;

            case 'deny':
            case 'cancel':
            case 'expire':
                $paymentStatus = 'failed';
                $orderStatus = 'cancelled';
                break;

            case 'refund':
            case 'partial_refund':
                $paymentStatus = 'refunded';
                $orderStatus = 'refunded';
                break;
        }

        // Update payment
        $payment->update([
            'status' => $paymentStatus,
            'payment_type' => $paymentType,
            'fraud_status' => $fraudStatus,
            'settlement_time' => $notification['settlement_time'] ?? null,
        ]);

        // Update order
        $order->update([
            'status' => $orderStatus,
        ]);

        Log::info('Payment and order status updated', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'payment_status' => $paymentStatus,
            'order_status' => $orderStatus,
            'transaction_status' => $transactionStatus,
        ]);
    }

    /**
     * Cancel payment
     */
    public function cancelPayment(string $orderId): bool
    {
        try {
            $result = Transaction::cancel($orderId);
            
            Log::info('Payment cancelled', [
                'order_id' => $orderId,
                'result' => $result,
            ]);

            return true;

        } catch (Exception $e) {
            Log::error('Failed to cancel payment', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Get payment URL for redirect
     */
    public function getPaymentUrls(): array
    {
        $environment = config('midtrans.environment');
        
        return [
            'finish_url' => route('payments.success'),
            'unfinish_url' => route('payments.pending'),
            'error_url' => route('payments.failed'),
        ];
    }
}