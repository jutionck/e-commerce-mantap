<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use App\Models\User;
use App\Services\MidtransService;
use Illuminate\Support\Facades\DB;

class TestPaymentCommand extends Command
{
    protected $signature = 'payment:test';
    protected $description = 'Test payment functionality with VA and QRIS';

    public function handle()
    {
        $this->info('🧪 Testing Payment System...');
        $this->newLine();

        // 1. Check available payment methods
        $this->info('📋 Available Payment Methods:');
        $midtransService = new MidtransService();
        $methods = $midtransService->getAvailablePaymentMethods();
        
        foreach ($methods as $key => $method) {
            $this->line("   ✅ {$method['name']} ({$key})");
            $this->line("      - {$method['description']}");
            
            if (isset($method['banks'])) {
                foreach ($method['banks'] as $bankKey => $bank) {
                    $this->line("        • {$bank['name']}");
                }
            }
            
            if (isset($method['features'])) {
                $features = implode(', ', $method['features']);
                $this->line("      Features: {$features}");
            }
            $this->newLine();
        }

        // 2. Create or find test user and order
        $this->info('👤 Setting up test data...');
        
        $user = User::where('email', 'test@example.com')->first();
        if (!$user) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password123'),
                'role' => 'customer'
            ]);
            $this->line("   ✅ Created test user: {$user->email}");
        } else {
            $this->line("   ✅ Using existing test user: {$user->email}");
        }

        // Create a new test order with unique order number
        $uniqueOrderNumber = 'TEST-' . time() . '-' . random_int(1000, 9999);
        
        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => $uniqueOrderNumber,
            'total_amount' => 100000,
            'status' => 'pending_payment',
            'shipping_cost' => 10000,
            'shipping_method' => 'Regular',
            'shipping_address' => json_encode([
                'name' => 'Test User',
                'address' => 'Jl. Test No. 123',
                'city' => 'Jakarta',
                'postal_code' => '12345',
                'phone' => '08123456789'
            ])
        ]);
        
        // Create test order item
        $testProduct = \App\Models\Product::first();
        if ($testProduct) {
            \App\Models\OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $testProduct->id,
                'quantity' => 1,
                'price' => 90000,
                'total' => 90000,
            ]);
        }
        
        $this->line("   ✅ Created test order: {$order->order_number}");

        $this->newLine();

        // 3. Test Virtual Account payment
        $this->info('💳 Testing Virtual Account Payment...');
        try {
            $vaPayment = $midtransService->createCoreApiPayment(
                $order, 
                'bank_transfer', 
                ['bank' => 'bca']
            );
            
            $this->line("   ✅ VA Payment created successfully!");
            $this->line("   Bank: BCA");
            if (isset($vaPayment['payment_instructions']['va_number'])) {
                $this->line("   VA Number: {$vaPayment['payment_instructions']['va_number']}");
            }
            $this->line("   Status: {$vaPayment['status']}");
        } catch (\Exception $e) {
            $this->error("   ❌ VA Payment failed: " . $e->getMessage());
        }

        $this->newLine();

        // 4. Test QRIS payment with new order
        $this->info('📱 Testing QRIS Payment...');
        try {
            // Create separate order for QRIS to avoid conflicts
            $qrisOrderNumber = 'TEST-QRIS-' . time() . '-' . random_int(1000, 9999);
            $qrisOrder = Order::create([
                'user_id' => $user->id,
                'order_number' => $qrisOrderNumber,
                'total_amount' => 100000,
                'status' => 'pending_payment',
                'shipping_cost' => 10000,
                'shipping_method' => 'Regular',
                'shipping_address' => json_encode([
                    'name' => 'Test User',
                    'address' => 'Jl. Test No. 123',
                    'city' => 'Jakarta',
                    'postal_code' => '12345',
                    'phone' => '08123456789'
                ])
            ]);
            
            // Create test order item for QRIS order
            if ($testProduct) {
                \App\Models\OrderItem::create([
                    'order_id' => $qrisOrder->id,
                    'product_id' => $testProduct->id,
                    'quantity' => 1,
                    'price' => 90000,
                    'total' => 90000,
                ]);
            }
            
            $qrisPayment = $midtransService->createCoreApiPayment(
                $qrisOrder, 
                'qris', 
                []
            );
            
            $this->line("   ✅ QRIS Payment created successfully!");
            if (isset($qrisPayment['payment_instructions']['qr_code_url'])) {
                $this->line("   QR Code URL: Available");
            }
            $this->line("   Status: {$qrisPayment['status']}");
        } catch (\Exception $e) {
            $this->error("   ❌ QRIS Payment failed: " . $e->getMessage());
        }

        $this->newLine();

        // 5. Check Midtrans configuration
        $this->info('🔧 Midtrans Configuration:');
        $this->line("   Server Key: " . (config('midtrans.server_key') ? '✅ Configured' : '❌ Missing'));
        $this->line("   Client Key: " . (config('midtrans.client_key') ? '✅ Configured' : '❌ Missing'));
        $this->line("   Environment: " . config('midtrans.environment'));
        
        $baseUrl = config('midtrans.urls.' . config('midtrans.environment') . '.core');
        $this->line("   API URL: {$baseUrl}");

        $this->newLine();
        $this->info('🎯 Payment URLs for testing:');
        $this->line("   Payment page: http://localhost:8000/payments/{$order->id}");
        $this->line("   Order details: http://localhost:8000/orders/{$order->id}");
        
        $this->newLine();
        $this->info('✅ Payment system test completed!');

        return 0;
    }
}