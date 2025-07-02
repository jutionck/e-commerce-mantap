<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProductTest extends TestCase
{
    use RefreshDatabase;

    private $admin;

    private $customer;

    private $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'admin_verified_at' => now(),
        ]);

        $this->customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $this->category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);
    }

    public function test_admin_can_view_products_index()
    {
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.products.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Products/Index')
                ->has('products.data', 1)
                ->has('categories', 1)
            );
    }

    public function test_customer_cannot_access_admin_products()
    {
        $response = $this->actingAs($this->customer)
            ->get(route('admin.products.index'));

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_admin_products()
    {
        $response = $this->get(route('admin.products.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_view_product_create_form()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.products.create'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Products/Create')
                ->has('categories', 1)
            );
    }

    public function test_admin_can_create_product()
    {
        $productData = [
            'name' => 'New Test Product',
            'category_id' => $this->category->id,
            'description' => 'A test product description',
            'price' => 99.99,
            'stock' => 10,
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.products.store'), $productData);

        $response->assertRedirect(route('admin.products.index'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('products', [
            'name' => 'New Test Product',
            'slug' => 'new-test-product',
            'category_id' => $this->category->id,
            'price' => 99.99,
            'stock' => 10,
        ]);
    }

    public function test_admin_can_view_product_details()
    {
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.products.show', $product));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Products/Show')
                ->where('product.id', $product->id)
            );
    }

    public function test_admin_can_view_product_edit_form()
    {
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.products.edit', $product));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Products/Edit')
                ->where('product.id', $product->id)
                ->has('categories', 1)
            );
    }

    public function test_admin_can_update_product()
    {
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
            'name' => 'Original Name',
            'price' => 50.00,
        ]);

        $updateData = [
            'name' => 'Updated Product Name',
            'category_id' => $this->category->id,
            'description' => 'Updated description',
            'price' => 75.00,
            'stock' => 20,
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.products.update', $product), $updateData);

        $response->assertRedirect(route('admin.products.index'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Product Name',
            'slug' => 'updated-product-name',
            'price' => 75.00,
            'stock' => 20,
        ]);
    }

    public function test_admin_can_delete_product()
    {
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.products.destroy', $product));

        $response->assertRedirect(route('admin.products.index'))
            ->assertSessionHas('success');

        $this->assertSoftDeleted('products', [
            'id' => $product->id,
        ]);
    }

    public function test_admin_products_can_be_searched()
    {
        $product1 = Product::factory()->create([
            'category_id' => $this->category->id,
            'name' => 'iPhone 15',
            'description' => 'Latest smartphone',
        ]);

        $product2 = Product::factory()->create([
            'category_id' => $this->category->id,
            'name' => 'Samsung Galaxy',
            'description' => 'Android phone',
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.products.index', ['search' => 'iPhone']));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Products/Index')
                ->has('products.data', 1)
                ->where('products.data.0.name', 'iPhone 15')
            );
    }

    public function test_admin_products_can_be_filtered_by_category()
    {
        $category2 = Category::create(['name' => 'Category 2', 'slug' => 'category-2']);

        $product1 = Product::factory()->create([
            'category_id' => $this->category->id,
            'name' => 'Product in Category 1',
        ]);

        $product2 = Product::factory()->create([
            'category_id' => $category2->id,
            'name' => 'Product in Category 2',
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.products.index', ['category' => $this->category->id]));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Products/Index')
                ->has('products.data', 1)
                ->where('products.data.0.name', 'Product in Category 1')
            );
    }

    public function test_product_validation_on_create()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.products.store'), [
                'name' => '', // Required field empty
                'category_id' => 'invalid', // Invalid category
                'price' => -10, // Negative price
                'stock' => -5, // Negative stock
            ]);

        $response->assertSessionHasErrors(['name', 'category_id', 'price', 'stock']);
    }

    public function test_product_validation_on_update()
    {
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->put(route('admin.products.update', $product), [
                'name' => '', // Required field empty
                'category_id' => 'invalid', // Invalid category
                'price' => -10, // Negative price
                'stock' => -5, // Negative stock
            ]);

        $response->assertSessionHasErrors(['name', 'category_id', 'price', 'stock']);
    }
}
