# 🛒 E-Commerce Laravel + React Application

## 📋 Project Overview

A modern, full-featured e-commerce application built with Laravel 12 + React 18 using Inertia.js for seamless SPA experience. This application provides complete e-commerce functionality with a professional admin panel for comprehensive store management.

## ✨ Key Features

### 🛍️ Customer Features
- **User Authentication** - Registration, login, password reset with email verification
- **Product Catalog** - Browse products with category filtering and search
- **Shopping Cart** - Add/remove products, quantity management, persistent cart
- **Checkout Process** - Shipping address, method selection, order creation
- **Order Management** - View order history, track order status
- **User Profile** - Update personal information, password management

### 🔧 Admin Panel (100% Complete ✅)
- **Dashboard** - Statistics overview, recent orders, quick navigation
- **Product Management** - Full CRUD with search, filtering, soft deletes, stock management
- **Category Management** - Full CRUD with product relationship protection
- **Order Management** - Advanced filtering, status updates, CSV export, customer info
- **User Management** - Role control, status toggle, order history, security safeguards
- **Role-Based Access** - Secure admin authentication with comprehensive permissions

## 🚀 Tech Stack

### Backend
- **Laravel 12** - PHP 8.2+ framework
- **SQLite** - Database (development), MySQL support
- **Eloquent ORM** - Database relationships and queries
- **Laravel Breeze** - Authentication scaffolding

### Frontend
- **React 18** - Modern UI library
- **Inertia.js** - SPA functionality without API complexity
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server

### Development Tools
- **PHPUnit** - Backend testing (88+ tests passing)
- **Laravel Pint** - Code formatting
- **Composer** - PHP dependency management
- **npm** - Node.js package management

## 📊 Current Implementation Status

### ✅ Completed Features (90% Complete)
- **Authentication System** (100%) - Complete user auth flow
- **Product Catalog** (100%) - Full product browsing experience
- **Shopping Cart** (100%) - Complete cart functionality
- **Order Management** (100%) - Customer order tracking
- **User Profile** (100%) - Account management
- **Admin Panel** (100%) - **FULLY FUNCTIONAL & PRODUCTION READY**
  - Products, Categories, Orders, Users management
  - Advanced search, filtering, pagination
  - Role-based security, comprehensive validation
  - Professional responsive interface
- **Database Architecture** (100%) - Complete schema with relationships

### 🔄 In Progress
- **Payment Gateway** (0%) - Midtrans Snap integration planned
- **Real Shipping API** (30%) - JNE/JNT integration (currently mock data)

## 🛠️ Installation & Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- SQLite (or MySQL)

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/jutionck/e-commerce-mantap.git
   cd e-commerce-mantap/app
   ```

2. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

5. **Build Frontend Assets**
   ```bash
   npm run build
   # or for development
   npm run dev
   ```

6. **Start Development Server**
   ```bash
   php artisan serve
   ```

## 🎯 Development Commands

### Main Development
```bash
composer dev          # Start all services (Laravel + queue + logs + Vite)
php artisan serve      # Laravel server only
npm run dev           # Vite dev server only
```

### Building & Testing
```bash
npm run build         # Build production assets
composer test         # Run all tests
./vendor/bin/pint     # Format code
php artisan optimize  # Optimize for production
```

### Database Operations
```bash
php artisan migrate:fresh --seed  # Reset database with fresh data
php artisan tinker                # Laravel REPL
php artisan route:list            # List all routes
```

## 👤 Default Admin Account

Access the admin panel with these credentials:
- **Email:** admin@ecommerce.com
- **Password:** admin123
- **URL:** http://localhost:8000/admin

## 🧪 Testing

### Run Tests
```bash
composer test                              # All tests
php artisan test --filter=AdminTest       # Admin tests only
php artisan test --filter=FeatureTest     # Feature tests only
```

### Test Coverage
- **Authentication Tests:** 24 tests ✅
- **Admin Product Tests:** 13 tests (105 assertions) ✅
- **Admin Category Tests:** 16 tests ✅
- **Admin Order Tests:** 13 tests ✅
- **Admin User Tests:** 15+ tests ✅
- **Total:** 88+ tests passing with comprehensive coverage

## 📁 Project Structure

```
app/
├── app/
│   ├── Http/Controllers/     # Laravel controllers
│   │   ├── Admin/           # Admin panel controllers
│   │   ├── Auth/            # Authentication controllers
│   │   └── ...              # Customer controllers
│   ├── Models/              # Eloquent models
│   └── Middleware/          # Custom middleware
├── resources/
│   ├── js/
│   │   ├── Components/      # Reusable React components
│   │   ├── Layouts/         # Layout components
│   │   └── Pages/           # Inertia.js page components
│   │       ├── Admin/       # Admin panel pages
│   │       ├── Auth/        # Authentication pages
│   │       └── ...          # Customer pages
│   └── css/                 # Styling files
├── routes/
│   ├── web.php             # Customer routes
│   ├── admin.php           # Admin routes
│   └── auth.php            # Authentication routes
├── database/
│   ├── migrations/         # Database schema
│   ├── seeders/           # Database seeders
│   └── factories/         # Model factories
└── tests/                 # PHPUnit tests
```

## 🔒 Security Features

### Authentication & Authorization
- **Session-based Authentication** - Laravel Breeze implementation
- **Role-based Access Control** - Admin/Customer roles
- **Admin Verification System** - Additional security layer
- **CSRF Protection** - Built-in Laravel protection
- **Password Hashing** - Secure password storage

### Admin Panel Security
- **Role Verification** - Only admin users can access admin panel
- **Self-Protection** - Admins cannot delete/deactivate themselves
- **Relationship Protection** - Prevent deletion of entities with dependencies
- **Form Validation** - Comprehensive input validation
- **Error Handling** - Secure error messages

## 🚀 Deployment

### Production Checklist
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Configure production database
- [ ] Set up SSL certificate
- [ ] Configure email settings
- [ ] Run `npm run build` for production assets
- [ ] Run `php artisan optimize` for performance
- [ ] Set up queue workers
- [ ] Configure backup strategy

## 📚 Documentation

- **[Installation Guide](../docs/installation-guide.md)** - Detailed setup instructions
- **[User Guide](../docs/user-guide.md)** - Complete user documentation
- **[Developer Guide](../docs/developer-guide.md)** - Development guidelines
- **[Features Status](../docs/features-status.md)** - Implementation progress
- **[API Documentation](../docs/api-documentation.md)** - API endpoints (coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PSR-12 coding standards
- Write tests for new features
- Update documentation for changes
- Use conventional commit messages
- Follow Laravel best practices

## 📝 Changelog

### v1.2.0 - July 1, 2025 - Admin Panel Complete
- ✅ **MAJOR:** Complete Admin Panel Implementation (100% functional)
- ✅ Full CRUD operations for Products, Categories, Orders, Users
- ✅ Advanced search, filtering, and pagination
- ✅ Role-based security and comprehensive validation
- ✅ Professional responsive admin interface
- ✅ 70+ new test cases with comprehensive coverage
- ✅ Enhanced database models and factories

### v1.1.0 - June 30, 2025 - Core E-Commerce Complete
- ✅ User authentication system
- ✅ Product catalog with categories
- ✅ Shopping cart functionality
- ✅ Order management system
- ✅ User profile management
- ✅ Basic admin authentication

### v1.0.0 - June 2025 - Initial Release
- ✅ Laravel + React foundation
- ✅ Basic e-commerce structure
- ✅ Database schema design

## 🎯 Roadmap

### Next Phase (Priority High)
- **Payment Gateway Integration** - Midtrans Snap implementation
- **Real Shipping API** - JNE/JNT integration
- **Email Notifications** - Order confirmations and updates

### Future Enhancements
- **Product Images** - Upload and gallery system
- **Advanced Search** - Elasticsearch integration
- **Product Reviews** - Rating and review system
- **Mobile App** - React Native implementation
- **Analytics Dashboard** - Advanced reporting
- **Multi-vendor Support** - Marketplace functionality

## 📧 Support

- **Issues:** [GitHub Issues](https://github.com/jutionck/e-commerce-mantap/issues)
- **Discussions:** [GitHub Discussions](https://github.com/jutionck/e-commerce-mantap/discussions)
- **Email:** [support@ecommerce.com](mailto:support@ecommerce.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Laravel Team** - For the amazing framework
- **React Team** - For the powerful UI library
- **Inertia.js Team** - For seamless SPA functionality
- **Tailwind CSS** - For utility-first CSS framework
- **Open Source Community** - For inspiration and contributions

---

<p align="center">
  <strong>🚀 Built with ❤️ using Laravel + React + Inertia.js</strong>
</p>