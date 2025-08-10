# Developer Guide - E-Commerce Application

## Daftar Isi
1. [Setup Development](#setup-development)
2. [Arsitektur Aplikasi](#arsitektur-aplikasi)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Frontend Components](#frontend-components)
6. [Testing](#testing)
7. [Deployment](#deployment)

## Setup Development

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- NPM
- SQLite (untuk development)
- MySQL (untuk production)

### Installation
```bash
# Clone repository
cd app/

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Build frontend assets
npm run build

# Start development server
composer dev
```

### Development Commands
```bash
# Start all services (server, queue, logs, vite)
composer dev

# Start individual services
php artisan serve              # Laravel server
npm run dev                   # Vite development
php artisan queue:listen      # Queue worker untuk background jobs
php artisan pail             # Real-time logs

# Payment & Order Management
php artisan test:payment --user=1 --amount=150000  # Create test payment
php artisan expired:payments                       # Process expired payments
php artisan schedule:work                          # Run scheduled tasks

# Build production assets
npm run build

# Run tests
composer test
php artisan test

# Code formatting
./vendor/bin/pint
```

## Arsitektur Aplikasi

### Tech Stack
- **Backend**: Laravel 12 + Midtrans Core API + RajaOngkir API
- **Frontend**: React 18 + Inertia.js + Toast Notifications
- **Database**: SQLite (dev), MySQL (prod)
- **Styling**: Tailwind CSS + Custom Components
- **Build Tool**: Vite
- **Authentication**: Laravel Breeze
- **Background Jobs**: Laravel Queue + Redis (prod)
- **Payment Processing**: Midtrans Core API dengan expiration handling
- **Shipping**: RajaOngkir API untuk real-time cost calculation

### Project Structure
```
app/
├── app/
│   ├── Http/Controllers/     # Request handling
│   ├── Models/              # Eloquent models
│   ├── Providers/           # Service providers
│   └── ...
├── database/
│   ├── migrations/          # Database schema
│   ├── seeders/            # Sample data
│   └── factories/          # Model factories
├── resources/
│   ├── js/
│   │   ├── Components/     # React components
│   │   │   ├── Payment/   # Payment-related components
│   │   │   └── ui/        # UI components (Toast, CopyButton)
│   │   ├── contexts/      # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── Layouts/       # Layout components
│   │   ├── Pages/         # Inertia pages
│   │   │   └── Payment/   # Payment flow pages
│   │   └── app.jsx       # Main entry point with ToastProvider
│   └── css/              # Styles
├── routes/
│   ├── web.php            # Web routes
│   └── auth.php           # Auth routes
└── tests/                 # Test files
```

### Core Architecture Patterns

#### MVC Pattern
- **Models**: Eloquent ORM models in `app/Models/`
- **Views**: React components in `resources/js/Pages/`
- **Controllers**: Request handlers in `app/Http/Controllers/`

#### Inertia.js Flow
```
Request → Controller → Inertia::render() → React Component → Response
```

#### Authentication
- Session-based authentication
- Laravel Breeze implementation
- Middleware protection for routes

## Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    email_verified_at TIMESTAMP,
    password VARCHAR(255),
    remember_token VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Categories
```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Products
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    category_id BIGINT FOREIGN KEY,
    description TEXT,
    price DECIMAL(10,2),
    stock INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Orders
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    user_id BIGINT FOREIGN KEY,
    order_number VARCHAR(255),
    total_amount DECIMAL(10,2),
    status VARCHAR(50),
    shipping_address JSON,
    shipping_method VARCHAR(255),
    shipping_cost DECIMAL(10,2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Order Items
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY,
    order_id BIGINT FOREIGN KEY,
    product_id BIGINT FOREIGN KEY,
    quantity INTEGER,
    price DECIMAL(10,2),
    total DECIMAL(10,2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Payments
```sql
CREATE TABLE payments (
    id BIGINT PRIMARY KEY,
    order_id BIGINT FOREIGN KEY,
    transaction_id VARCHAR(255),
    payment_method VARCHAR(255),
    amount DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Model Relationships

#### Product Model
```php
// app/Models/Product.php
class Product extends Model {
    public function category(): BelongsTo {
        return $this->belongsTo(Category::class);
    }
    
    public function orderItems(): HasMany {
        return $this->hasMany(OrderItem::class);
    }
}
```

#### Order Model
```php
// app/Models/Order.php
class Order extends Model {
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
    
    public function orderItems(): HasMany {
        return $this->hasMany(OrderItem::class);
    }
    
    public function payment(): HasOne {
        return $this->hasOne(Payment::class);
    }
}
```

## API Endpoints

### Public Routes
```php
GET  /                           # Product catalog
GET  /products/{product}         # Product detail
GET  /cart                      # Cart view
POST /cart                      # Add to cart
PATCH /cart/{product}           # Update cart item
DELETE /cart/{product}          # Remove from cart
POST /shipping-cost             # Calculate shipping
```

### Authenticated Routes
```php
GET  /checkout                  # Checkout page
POST /checkout                  # Create order
GET  /orders                    # Order history
GET  /orders/{order}            # Order detail
GET  /profile                   # Profile edit
PATCH /profile                  # Update profile
DELETE /profile                 # Delete account

# Payment Routes
GET  /payments/{order}          # Show payment page dengan countdown
POST /payments/{payment}/cancel # Cancel a payment
GET  /payments/{order}/check-status # Check payment status (AJAX)
GET  /payments/{order}/expired  # Expired payment recovery page
```

### Public Payment Routes
```php
# Midtrans Webhook
POST /payments/notification     # Handle payment notifications

# Midtrans Redirects
GET  /payments/success          # Success redirect
GET  /payments/pending          # Pending redirect
GET  /payments/failed           # Failed redirect
```

### Auth Routes (via Laravel Breeze)
```php
GET  /register                  # Registration form
POST /register                  # Register user
GET  /login                     # Login form
POST /login                     # Authenticate user
POST /logout                    # Logout user
GET  /forgot-password           # Password reset form
POST /forgot-password           # Send reset email
GET  /reset-password/{token}    # Reset password form
POST /reset-password            # Reset password
```

## Frontend Components

### Layout Components

#### AuthenticatedLayout
```jsx
// resources/js/Layouts/AuthenticatedLayout.jsx
// Main layout untuk authenticated users
// Includes navigation, user dropdown, responsive menu
```

#### GuestLayout
```jsx
// resources/js/Layouts/GuestLayout.jsx
// Layout untuk guest users (login, register)
```

### Page Components

#### Product Pages
```jsx
// resources/js/Pages/Index.jsx
// Main product catalog with grid layout

// resources/js/Pages/Product/Show.jsx
// Product detail page with add to cart
```

#### Cart & Checkout
```jsx
// resources/js/Pages/Cart/Index.jsx
// Shopping cart management

// resources/js/Pages/Checkout/Index.jsx
// Checkout form with shipping address
```

#### Order Management
```jsx
// resources/js/Pages/Orders/Index.jsx
// Order history listing

// resources/js/Pages/Orders/Show.jsx
// Detailed order view
```

#### Authentication
```jsx
// resources/js/Pages/Auth/Login.jsx
// resources/js/Pages/Auth/Register.jsx
// resources/js/Pages/Auth/ForgotPassword.jsx
// etc.
```

### Reusable Components
```jsx
// resources/js/Components/
ApplicationLogo.jsx      # App logo
Checkbox.jsx            # Checkbox input
Dropdown.jsx            # Dropdown menu
InputError.jsx          # Error message display
InputLabel.jsx          # Form label
Modal.jsx               # Modal dialog
NavLink.jsx             # Navigation link
PrimaryButton.jsx       # Primary button
SecondaryButton.jsx     # Secondary button
TextInput.jsx           # Text input field

// Payment Components
Payment/PaymentCountdown.jsx     # Real-time countdown timer
Payment/PaymentInstructions.jsx  # Payment instructions dengan copy buttons

// UI Components
ui/Toast.jsx            # Modern toast notification system
ui/CopyButton.jsx       # Copy functionality dengan fallbacks
```

### State Management
- **Cart**: Session-based storage
- **Authentication**: Laravel session
- **Forms**: Inertia.js useForm hook
- **Navigation**: Inertia.js router
- **Notifications**: React Context (ToastContext)
- **Global State**: React hooks dengan Context providers

## Testing

### Test Structure
```
tests/
├── Feature/               # Feature tests
│   ├── Auth/             # Authentication tests
│   ├── ExampleTest.php   # Basic route test
│   └── ProfileTest.php   # Profile tests
└── Unit/                 # Unit tests
    └── ExampleTest.php   # Basic unit test
```

### Running Tests
```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test --filter=ExampleTest

# Run with coverage
php artisan test --coverage
```

### Test Database
- Uses in-memory SQLite (`:memory:`)
- RefreshDatabase trait for clean state
- Configured in phpunit.xml

### Writing Tests
```php
<?php
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase {
    use RefreshDatabase;
    
    public function test_user_can_create_order() {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        
        $response = $this->actingAs($user)
            ->post('/checkout', [
                'shipping_address' => [...],
                'shipping_method' => 'JNE Regular',
                'shipping_cost' => 15000,
            ]);
            
        $response->assertRedirect();
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
        ]);
    }
}
```

## Deployment

### Production Setup

#### Environment Configuration
```bash
# .env production settings
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

MAIL_MAILER=smtp
# Configure mail settings
```

#### Build Process
```bash
# Install dependencies
composer install --optimize-autoloader --no-dev
npm ci

# Build assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force
```

#### Web Server Configuration
```nginx
# Nginx configuration example
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/app/public;
    
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Monitoring & Maintenance

#### Logs
```bash
# View logs
php artisan pail

# Clear logs
php artisan log:clear
```

#### Queue Management
```bash
# Start queue worker
php artisan queue:work

# Restart queue workers
php artisan queue:restart
```

#### Cache Management
```bash
# Clear all caches
php artisan optimize:clear

# Rebuild caches
php artisan optimize
```

### Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database credentials protected
- [ ] File permissions set correctly
- [ ] Regular security updates
- [ ] Input validation implemented
- [ ] CSRF protection enabled
- [ ] Rate limiting configured

---

## Contributing

### Code Style
- Follow PSR-12 for PHP code
- Use Laravel Pint for formatting
- Follow React/JavaScript best practices
- Use meaningful variable names
- Add comments for complex logic

### Git Workflow
1. Create feature branch
2. Make changes with descriptive commits
3. Run tests locally
4. Create pull request
5. Code review process
6. Merge to main branch

### Development Guidelines
- Write tests for new features
- Update documentation
- Follow existing code patterns
- Use TypeScript for complex components
- Optimize database queries
- Handle errors gracefully