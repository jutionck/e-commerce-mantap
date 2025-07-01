<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminOrderTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $customer;
    private $order;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'admin_verified_at' => now()
        ]);

        $this->customer = User::factory()->create([
            'role' => 'customer'
        ]);

        $category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category'
        ]);

        $product = Product::factory()->create([
            'category_id' => $category->id,
            'price' => 100.00
        ]);

        $this->order = Order::create([
            'user_id' => $this->customer->id,
            'order_number' => 'ORD-TEST-001',
            'status' => 'pending',
            'total_amount' => 200.00,
            'shipping_address' => [
                'name' => 'Test User',
                'phone' => '08123456789',
                'address' => 'Test Address 123',
                'city' => 'Jakarta',
                'postal_code' => '12345'
            ],
            'shipping_method' => 'JNE REG',
            'shipping_cost' => 25.00
        ]);

        OrderItem::create([
            'order_id' => $this->order->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 100.00,
            'total' => 200.00
        ]);
    }

    public function test_admin_can_view_orders_index()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.orders.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Orders/Index')
                ->has('orders.data', 1)
                ->has('statusOptions')
            );
    }

    public function test_customer_cannot_access_admin_orders()
    {
        $response = $this->actingAs($this->customer)
            ->get(route('admin.orders.index'));

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_admin_orders()
    {
        $response = $this->get(route('admin.orders.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_view_order_details()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.orders.show', $this->order));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Orders/Show')
                ->where('order.id', $this->order->id)
            );
    }

    public function test_admin_can_update_order_status()
    {
        $response = $this->actingAs($this->admin)
            ->patch(route('admin.orders.updateStatus', $this->order), [
                'status' => 'confirmed'
            ]);

        $response->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('orders', [
            'id' => $this->order->id,
            'status' => 'confirmed'
        ]);
    }

    public function test_admin_orders_can_be_searched_by_order_number()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.orders.index', ['search' => 'ORD-TEST-001']));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Orders/Index')
                ->has('orders.data', 1)
                ->where('orders.data.0.order_number', 'ORD-TEST-001')
            );
    }

    public function test_admin_orders_can_be_searched_by_customer_name()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.orders.index', ['search' => $this->customer->name]));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Orders/Index')
                ->has('orders.data', 1)
                ->where('orders.data.0.user.name', $this->customer->name)
            );
    }

    public function test_admin_orders_can_be_filtered_by_status()
    {
        // Create another order with different status
        $confirmedOrder = Order::create([
            'user_id' => $this->customer->id,
            'order_number' => 'ORD-TEST-002',
            'status' => 'confirmed',
            'total_amount' => 150.00,
            'shipping_address' => [
                'name' => 'Test User 2',
                'phone' => '08123456789',
                'address' => 'Test Address 456',
                'city' => 'Bandung',
                'postal_code' => '54321'
            ],
            'shipping_method' => 'JNT REG',
            'shipping_cost' => 20.00
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.orders.index', ['status' => 'pending']));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Orders/Index')
                ->has('orders.data', 1)
                ->where('orders.data.0.status', 'pending')
            );
    }

    public function test_admin_orders_can_be_filtered_by_date_range()
    {
        $today = now()->format('Y-m-d');

        $response = $this->actingAs($this->admin)
            ->get(route('admin.orders.index', [
                'date_from' => $today,
                'date_to' => $today
            ]));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Orders/Index')
                ->has('orders.data', 1)
            );
    }

    public function test_admin_can_export_orders()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.orders.export'));

        $response->assertOk();
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
        $response->assertHeader('content-disposition', function ($value) {
            return str_contains($value, 'orders_export_');
        });
    }

    public function test_order_status_validation()
    {
        $response = $this->actingAs($this->admin)
            ->patch(route('admin.orders.updateStatus', $this->order), [
                'status' => 'invalid_status'
            ]);

        $response->assertSessionHasErrors(['status']);
    }

    public function test_customer_cannot_update_order_status()
    {
        $response = $this->actingAs($this->customer)
            ->patch(route('admin.orders.updateStatus', $this->order), [
                'status' => 'confirmed'
            ]);

        $response->assertStatus(403);
    }

    public function test_guest_cannot_update_order_status()
    {
        $response = $this->patch(route('admin.orders.updateStatus', $this->order), [
            'status' => 'confirmed'
        ]);

        $response->assertRedirect(route('login'));
    }
}
