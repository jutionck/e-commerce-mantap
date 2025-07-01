<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCategoryTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $customer;

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
    }

    public function test_admin_can_view_categories_index()
    {
        $category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category'
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.categories.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Categories/Index')
                ->has('categories.data', 1)
            );
    }

    public function test_customer_cannot_access_admin_categories()
    {
        $response = $this->actingAs($this->customer)
            ->get(route('admin.categories.index'));

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_admin_categories()
    {
        $response = $this->get(route('admin.categories.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_view_category_create_form()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.categories.create'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Categories/Create')
            );
    }

    public function test_admin_can_create_category()
    {
        $categoryData = [
            'name' => 'New Category'
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.categories.store'), $categoryData);

        $response->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('categories', [
            'name' => 'New Category',
            'slug' => 'new-category'
        ]);
    }

    public function test_admin_can_view_category_details()
    {
        $category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category'
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.categories.show', $category));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Categories/Show')
                ->where('category.id', $category->id)
            );
    }

    public function test_admin_can_view_category_edit_form()
    {
        $category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category'
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.categories.edit', $category));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Categories/Edit')
                ->where('category.id', $category->id)
            );
    }

    public function test_admin_can_update_category()
    {
        $category = Category::create([
            'name' => 'Original Category',
            'slug' => 'original-category'
        ]);

        $updateData = [
            'name' => 'Updated Category'
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.categories.update', $category), $updateData);

        $response->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category',
            'slug' => 'updated-category'
        ]);
    }

    public function test_admin_can_delete_empty_category()
    {
        $category = Category::create([
            'name' => 'Empty Category',
            'slug' => 'empty-category'
        ]);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.categories.destroy', $category));

        $response->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id
        ]);
    }

    public function test_admin_cannot_delete_category_with_products()
    {
        $category = Category::create([
            'name' => 'Category with Products',
            'slug' => 'category-with-products'
        ]);

        Product::factory()->create([
            'category_id' => $category->id
        ]);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.categories.destroy', $category));

        $response->assertRedirect()
            ->assertSessionHas('error');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id
        ]);
    }

    public function test_admin_categories_can_be_searched()
    {
        Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics'
        ]);

        Category::create([
            'name' => 'Books',
            'slug' => 'books'
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.categories.index', ['search' => 'Electronics']));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Categories/Index')
                ->has('categories.data', 1)
                ->where('categories.data.0.name', 'Electronics')
            );
    }

    public function test_category_name_must_be_unique()
    {
        Category::create([
            'name' => 'Unique Category',
            'slug' => 'unique-category'
        ]);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.categories.store'), [
                'name' => 'Unique Category'
            ]);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_category_name_is_required()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.categories.store'), [
                'name' => ''
            ]);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_category_shows_product_count()
    {
        $category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category'
        ]);

        Product::factory()->count(3)->create([
            'category_id' => $category->id
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.categories.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Categories/Index')
                ->where('categories.data.0.products_count', 3)
            );
    }

    public function test_customer_cannot_create_category()
    {
        $response = $this->actingAs($this->customer)
            ->post(route('admin.categories.store'), [
                'name' => 'New Category'
            ]);

        $response->assertStatus(403);
    }

    public function test_guest_cannot_create_category()
    {
        $response = $this->post(route('admin.categories.store'), [
            'name' => 'New Category'
        ]);

        $response->assertRedirect(route('login'));
    }
}
