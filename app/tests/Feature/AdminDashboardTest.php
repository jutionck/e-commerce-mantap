<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'admin_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Dashboard'));
    }

    public function test_customer_cannot_access_admin_dashboard(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $response = $this->actingAs($customer)->get('/admin');

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_admin_dashboard(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/login');
    }
}
