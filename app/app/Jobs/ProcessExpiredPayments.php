<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessExpiredPayments implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('Starting expired payments cleanup job');
        
        $expiredCount = 0;
        $processedCount = 0;
        
        // Find all orders that should be expired but aren't marked as such
        $orders = Order::whereIn('status', ['pending', 'pending_payment'])
            ->where('created_at', '<', now()->subHours(config('midtrans.payment_timeout', 24)))
            ->get();
        
        foreach ($orders as $order) {
            $processedCount++;
            
            if ($order->isPaymentExpired()) {
                Log::info('Marking order as expired', [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'created_at' => $order->created_at,
                    'expired_at' => $order->getPaymentExpiryTime()
                ]);
                
                // Mark order as expired
                $order->update(['status' => 'expired']);
                
                // Mark payment as expired if exists
                $payment = $order->payment;
                if ($payment && in_array($payment->status, ['pending', 'processing'])) {
                    $payment->update(['status' => 'expired']);
                    
                    Log::info('Payment marked as expired', [
                        'payment_id' => $payment->id,
                        'order_number' => $order->order_number
                    ]);
                }
                
                $expiredCount++;
                
                // TODO: Send notification email to customer about expired payment
                // TODO: Restore product stock if needed
                // TODO: Cancel payment in Midtrans if needed
            }
        }
        
        Log::info('Expired payments cleanup completed', [
            'orders_processed' => $processedCount,
            'orders_expired' => $expiredCount
        ]);
    }
}