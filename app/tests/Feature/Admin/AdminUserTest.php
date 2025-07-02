<?php

namespace Tests\Feature\Admin;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AdminUserTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
    }

    public function test_admin_can_view_users_index()
    {
        $users = User::factory()->count(5)->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Users/Index')
            ->has('users.data', 6) // 5 created + 1 admin
        );
    }

    public function test_admin_can_search_users()
    {
        $john = User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
        $jane = User::factory()->create(['name' => 'Jane Smith', 'email' => 'jane@example.com']);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index', ['search' => 'john']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('users.data', 1)
            ->where('users.data.0.name', 'John Doe')
        );
    }

    public function test_admin_can_filter_users_by_role()
    {
        User::factory()->count(3)->create(['role' => 'customer']);
        User::factory()->count(2)->create(['role' => 'admin']);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index', ['role' => 'admin']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('users.data', 3) // 2 created + 1 setup admin
        );
    }

    public function test_admin_can_filter_users_by_date_range()
    {
        $oldUser = User::factory()->create(['created_at' => now()->subDays(10)]);
        $newUser = User::factory()->create(['created_at' => now()->subDays(2)]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index', [
                'date_from' => now()->subDays(5)->format('Y-m-d'),
                'date_to' => now()->format('Y-m-d'),
            ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('users.data', 2) // 1 new user + 1 admin
        );
    }

    public function test_admin_can_view_user_details()
    {
        $user = User::factory()->create();
        $orders = Order::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.show', $user));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Users/Show')
            ->where('user.id', $user->id)
            ->where('user.name', $user->name)
            ->has('user.orders', 3)
        );
    }

    public function test_admin_can_create_new_user()
    {
        $userData = [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'customer',
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.store'), $userData);

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('message', 'User created successfully');

        $this->assertDatabaseHas('users', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'role' => 'customer',
        ]);

        $user = User::where('email', 'newuser@example.com')->first();
        $this->assertNotNull($user->email_verified_at);
    }

    public function test_admin_can_create_admin_user()
    {
        $userData = [
            'name' => 'New Admin',
            'email' => 'newadmin@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'admin',
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.store'), $userData);

        $response->assertRedirect(route('admin.users.index'));

        $user = User::where('email', 'newadmin@example.com')->first();
        $this->assertEquals('admin', $user->role);
        $this->assertNotNull($user->email_verified_at);
    }

    public function test_user_creation_validation()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.store'), []);

        $response->assertSessionHasErrors(['name', 'email', 'password', 'role']);
    }

    public function test_email_must_be_unique_for_user_creation()
    {
        $existingUser = User::factory()->create();

        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.store'), [
                'name' => 'Test User',
                'email' => $existingUser->email,
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'customer',
            ]);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_admin_can_update_user()
    {
        $user = User::factory()->create(['role' => 'customer']);

        $updateData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'admin',
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.users.update', $user), $updateData);

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('message', 'User updated successfully');

        $user->refresh();
        $this->assertEquals('Updated Name', $user->name);
        $this->assertEquals('updated@example.com', $user->email);
        $this->assertEquals('admin', $user->role);
    }

    public function test_admin_can_update_user_password()
    {
        $user = User::factory()->create();
        $oldPasswordHash = $user->password;

        $updateData = [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.users.update', $user), $updateData);

        $response->assertRedirect(route('admin.users.index'));

        $user->refresh();
        $this->assertNotEquals($oldPasswordHash, $user->password);
    }

    public function test_password_update_is_optional()
    {
        $user = User::factory()->create();
        $oldPasswordHash = $user->password;

        $updateData = [
            'name' => 'Updated Name',
            'email' => $user->email,
            'role' => $user->role,
            'password' => '',
            'password_confirmation' => '',
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.users.update', $user), $updateData);

        $response->assertRedirect(route('admin.users.index'));

        $user->refresh();
        $this->assertEquals('Updated Name', $user->name);
        $this->assertEquals($oldPasswordHash, $user->password);
    }

    public function test_email_must_be_unique_for_user_update()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $response = $this->actingAs($this->admin)
            ->put(route('admin.users.update', $user1), [
                'name' => $user1->name,
                'email' => $user2->email,
                'role' => $user1->role,
            ]);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_admin_can_toggle_user_status()
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.toggle-status', $user));

        $response->assertRedirect();
        $response->assertSessionHas('message', 'User status updated successfully');

        $user->refresh();
        $this->assertNull($user->email_verified_at);

        // Toggle again
        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.toggle-status', $user));

        $user->refresh();
        $this->assertNotNull($user->email_verified_at);
    }

    public function test_admin_cannot_deactivate_themselves()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.toggle-status', $this->admin));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'You cannot deactivate your own account.');

        $this->admin->refresh();
        $this->assertNotNull($this->admin->email_verified_at);
    }

    public function test_admin_can_delete_user_without_orders()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.destroy', $user));

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('message', 'User deleted successfully');

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_admin_cannot_delete_user_with_orders()
    {
        $user = User::factory()->create();
        Order::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.destroy', $user));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Cannot delete user with existing orders');

        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    public function test_admin_cannot_delete_themselves()
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.destroy', $this->admin));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'You cannot delete your own account.');

        $this->assertDatabaseHas('users', ['id' => $this->admin->id]);
    }

    public function test_customer_cannot_access_user_management()
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($customer)
            ->get(route('admin.users.index'));

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_user_management()
    {
        $response = $this->get(route('admin.users.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_users_list_includes_order_count()
    {
        $user = User::factory()->create();
        Order::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index'));

        $response->assertInertia(fn ($page) => $page->has('users.data', function ($users) use ($user) {
            $foundUser = collect($users)->firstWhere('id', $user->id);

            return $foundUser && $foundUser['orders_count'] === 3;
        })
        );
    }

    public function test_user_show_includes_order_details()
    {
        $user = User::factory()->create();
        $orders = Order::factory()->count(2)->create(['user_id' => $user->id]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.show', $user));

        $response->assertInertia(fn ($page) => $page->has('user.orders', 2)
        );
    }

    public function test_user_create_form_loads()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Users/Create')
        );
    }

    public function test_user_edit_form_loads()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.edit', $user));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Users/Edit')
            ->where('user.id', $user->id)
        );
    }

    public function test_role_options_are_provided()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index'));

        $response->assertInertia(fn ($page) => $page->has('roleOptions')
            ->where('roleOptions.admin', 'Administrator')
            ->where('roleOptions.customer', 'Customer')
        );
    }
}
