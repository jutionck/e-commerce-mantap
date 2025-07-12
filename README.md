# E-Commerce Mantap 🛒

**Modern E-Commerce Platform dengan Laravel + React**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/your-repo)
[![Laravel](https://img.shields.io/badge/Laravel-12-red.svg)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue.svg)](https://tailwindcss.com/)
[![Progress](https://img.shields.io/badge/Progress-85%25-brightgreen.svg)](#status-progress)

Aplikasi e-commerce modern yang dibangun dengan Laravel sebagai backend dan React + Inertia.js sebagai frontend. Dilengkapi dengan sistem manajemen produk, keranjang belanja, checkout, dan order management yang lengkap.

## 📸 Preview

```
🏠 Homepage → 🛍️ Product Catalog → 🛒 Shopping Cart → 💳 Checkout → 📦 Order Management
```

**Live Demo:** [Demo Link] (Coming Soon)

## ✨ Fitur Utama

### ✅ **Sudah Berfungsi Sempurna**
- 🔐 **Authentication System** - Register, login, reset password
- 🛍️ **Product Catalog** - Browse produk dengan kategori
- 🛒 **Shopping Cart** - Add, update, remove items
- 💳 **Checkout Process** - Form alamat dan pengiriman lengkap
- 📦 **Order Management** - History dan detail pesanan dengan tracking
- 💰 **Payment Gateway** - Integrasi Midtrans Snap dengan multiple payment methods
- 👤 **User Profile** - Kelola akun dan informasi pribadi
- 🏢 **Admin Panel** - Dashboard admin dengan role-based access
- 📱 **Responsive Design** - Mobile-friendly interface

### 🔄 **Dalam Pengembangan**
- 📋 **Admin CRUD** - Product & order management (advanced features)
- 🚚 **Shipping API** - Integrasi real-time JNE, JNT, dll
- 📧 **Email Notifications** - Konfirmasi pesanan dan status update

### 💰 **Payment Features (Baru!)**
- 🔥 **Multiple Payment Methods** - QRIS, GoPay, DANA, ShopeePay, LinkAja, OVO, Credit Card, Bank Transfer
- 📱 **Midtrans Snap Integration** - Seamless payment experience
- 🔄 **Real-time Status Sync** - Manual payment status checking
- 🏦 **Bank Detection** - Otomatis detect bank (BCA VA, BNI VA, dll)
- 📊 **Payment Tracking** - Detail transaction history dengan settlement time

### 📋 **Roadmap**
- 🖼️ **Product Images** - Upload dan gallery
- 🔍 **Search & Filter** - Advanced product search
- ⭐ **Reviews & Ratings** - User feedback system
- 📊 **Analytics** - Google Analytics integration

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- NPM

### Installation
```bash
# Clone repository
git clone <repository-url>
cd e-commerce-mantap/app

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate
php artisan db:seed
php artisan db:seed --class=AdminUserSeeder

# Setup Midtrans (optional - for payment testing)
# Add your Midtrans keys to .env:
# MIDTRANS_MERCHANT_ID=your_merchant_id
# MIDTRANS_CLIENT_KEY=your_client_key  
# MIDTRANS_SERVER_KEY=your_server_key

# Build assets dan start server
npm run build
composer dev
```

**Aplikasi akan berjalan di:** http://localhost:8000

> 💡 **Untuk panduan instalasi lengkap, lihat [Installation Guide](docs/installation-guide.md)**

## 📚 Dokumentasi Lengkap

Kami menyediakan dokumentasi komprehensif di folder [`docs/`](docs/) untuk berbagai kebutuhan:

### 📖 **Untuk Pengguna**
- **[User Guide](docs/user-guide.md)** - Panduan lengkap menggunakan aplikasi
  - ✅ Cara registrasi dan login
  - ✅ Belanja dan keranjang
  - ✅ Checkout dan pembayaran
  - ✅ Mengelola pesanan

### 👨‍💻 **Untuk Developer**
- **[Developer Guide](docs/developer-guide.md)** - Panduan teknis development
  - ✅ Arsitektur aplikasi (Laravel + React + Inertia.js)
  - ✅ Database schema dan relationships
  - ✅ API endpoints documentation
  - ✅ Frontend components structure
  - ✅ Testing dan deployment

- **[Installation Guide](docs/installation-guide.md)** - Setup development environment
  - ✅ System requirements
  - ✅ Step-by-step installation
  - ✅ Database configuration
  - ✅ Troubleshooting common issues
  - ✅ Production deployment

### 📊 **Project Status**
- **[Features Status](docs/features-status.md)** - Progress dan status implementasi
  - ✅ Detailed progress tracking (65% complete)
  - ✅ Fitur yang sudah selesai vs belum
  - ✅ Development roadmap
  - ✅ Testing status dan known issues

- **[Background](docs/background.md)** - Project requirements asli
  - ✅ Spesifikasi fitur yang direncanakan
  - ✅ Teknologi stack yang digunakan

### 📋 **Documentation Index**
- **[Documentation Overview](docs/README.md)** - Panduan navigasi dokumentasi

## 🛠️ Tech Stack

### Backend
- **Laravel 12** - PHP framework untuk robust backend
- **PHP 8.2** - Modern PHP dengan performance optimization
- **SQLite/MySQL** - Database untuk development dan production
- **Eloquent ORM** - Database relationships dan query builder
- **Midtrans Snap** - Payment gateway integration untuk multiple payment methods

### Frontend
- **React 18** - Modern frontend library
- **Inertia.js** - SPA-like experience tanpa API complexity
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool dan development server

### Development Tools
- **Laravel Breeze** - Authentication scaffolding
- **Laravel Pint** - Code formatting
- **PHPUnit** - Backend testing
- **Composer** - PHP dependency management
- **NPM** - Frontend dependency management

## 📈 Status Progress

**Overall Completion: 85%** 🎯

| Modul | Status | Progress |
|-------|--------|----------|
| 🔐 Authentication | ✅ Complete | 100% |
| 🛍️ Product Catalog | ✅ Complete | 100% |
| 🛒 Shopping Cart | ✅ Complete | 100% |
| 📦 Order Management | ✅ Complete | 100% |
| 🏢 Admin Panel | ✅ Complete | 100% |
| 💰 Payment Gateway | ✅ Complete | 95% |
| 💳 Checkout Process | ✅ Complete | 95% |
| 🚚 Shipping Integration | ⚠️ Mock | 30% |
| 📋 Admin CRUD | 🔄 In Progress | 20% |
| 📧 Email Notifications | ❌ Not Started | 0% |

> 📊 **Detail progress bisa dilihat di [Features Status](docs/features-status.md)**

## 🎯 Demo & Testing

### User Demo Flow
1. **Homepage** - Browse katalog produk dengan carousel dan flash sale
2. **Product Detail** - Lihat detail dan add to cart
3. **Shopping Cart** - Kelola items di keranjang dengan dropdown preview
4. **Checkout** - Isi alamat pengiriman dan pilih metode
5. **Payment** - Bayar menggunakan Midtrans (QRIS, GoPay, Bank Transfer, dll)
6. **Order History** - Lihat pesanan di "Pesanan Saya" dengan status real-time

### Test Accounts
Setelah menjalankan AdminUserSeeder:

**Admin Account:**
- Email: `admin@ecommerce.com`
- Password: `admin123`
- Access: Admin Panel + Customer features

**Customer Account:**
- Email: `customer@example.com`  
- Password: `customer123`
- Access: Customer features only

### Testing Commands
```bash
# Run all tests
php artisan test

# Run dengan coverage
php artisan test --coverage

# Frontend build test
npm run build
```

## 🚧 Development

### Development Commands
```bash
# Start all services (recommended)
composer dev

# Individual services
php artisan serve          # Backend server
npm run dev               # Frontend dev server
php artisan queue:listen  # Queue worker
php artisan pail         # Real-time logs
```

### Code Quality
```bash
# Format PHP code
./vendor/bin/pint

# Run tests
composer test

# Check application status
php artisan about
```

### Database Management
```bash
# Fresh migration dengan seed
php artisan migrate:fresh --seed

# Check migration status
php artisan migrate:status

# Database interaction
php artisan tinker
```

## 🔧 Architecture Overview

### Request Flow
```
Browser → Laravel Router → Controller → Inertia::render() → React Component → Response
```

### Database Relationships
```
User (1) → (n) Orders (1) → (n) OrderItems (n) → (1) Product (n) → (1) Category
                     ↓
                 (1) Payment
```

### Folder Structure
```
app/
├── app/Http/Controllers/    # Request handlers
├── app/Models/              # Eloquent models
├── database/migrations/     # Database schema
├── resources/js/Pages/      # React components
├── resources/js/Components/ # Reusable components
├── routes/web.php          # Application routes
└── docs/                   # Documentation
```

> 🏗️ **Detail arsitektur ada di [Developer Guide](docs/developer-guide.md)**

## 🚀 Deployment

### Development
```bash
composer dev  # Start all services
```

### Production
```bash
# Build optimized assets
npm run build
php artisan optimize

# Start with process manager
php artisan serve --env=production
```

> 🚀 **Panduan deployment lengkap di [Installation Guide](docs/installation-guide.md)**

## 🤝 Contributing

Kami sangat welcome untuk kontribusi! Berikut cara berkontribusi:

1. **Fork** repository ini
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** ke branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### Development Guidelines
- Ikuti PSR-12 untuk PHP code style
- Gunakan Laravel Pint untuk formatting
- Write tests untuk fitur baru
- Update dokumentasi sesuai perubahan

> 📝 **Detail development guidelines di [Developer Guide](docs/developer-guide.md)**

## 📋 Roadmap

### Phase 1: Core E-Commerce ✅ (Complete)
- ✅ User authentication
- ✅ Product catalog
- ✅ Shopping cart
- ✅ Order management
- ✅ Admin panel with role-based access

### Phase 2: Payment & CRUD ✅ (95% Complete)
- ✅ Payment gateway (Midtrans Snap) - Multiple payment methods
- ✅ Payment status synchronization - Real-time status updates
- ✅ Enhanced checkout flow - Complete address and shipping
- 🔄 Admin product/order CRUD - Advanced features
- 🔄 Real shipping API integration - JNE, JNT integration

### Phase 3: User Experience 📅 (Planned)
- 📅 Email notifications
- 📅 Product images
- 📅 Order tracking

### Phase 4: Advanced Features 🎯 (Future)
- 🎯 Search & filtering
- 🎯 Reviews & ratings
- 🎯 SEO optimization
- 🎯 Analytics integration

## 🐛 Known Issues

- ⚠️ Shipping cost calculation masih menggunakan mock data (JNE/JNT API integration pending)
- ⚠️ Email notifications belum diimplementasi
- ⚠️ Webhook Midtrans untuk production deployment belum dikonfigurasi (manual status sync tersedia)

> 🔍 **List lengkap known issues di [Features Status](docs/features-status.md)**

## 📞 Support & Documentation

### 📚 Dokumentasi
- **User Guide:** [docs/user-guide.md](docs/user-guide.md)
- **Developer Guide:** [docs/developer-guide.md](docs/developer-guide.md)
- **Installation Guide:** [docs/installation-guide.md](docs/installation-guide.md)
- **Features Status:** [docs/features-status.md](docs/features-status.md)

### 🆘 Troubleshooting
1. Check [Installation Guide](docs/installation-guide.md) troubleshooting section
2. Review Laravel logs: `storage/logs/laravel.log`
3. Run diagnostics: `php artisan about`

### 💬 Community
- **Issues:** [GitHub Issues](#)
- **Discussions:** [GitHub Discussions](#)
- **Email:** support@ecommerce.com

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Laravel Team** - Untuk framework yang amazing
- **React Team** - Untuk frontend library yang powerful
- **Inertia.js** - Untuk bridging Laravel dan React dengan elegan
- **Tailwind CSS** - Untuk utility-first CSS framework

---

<div align="center">

**🚀 Built with ❤️ using Laravel + React + Inertia.js**

[📚 Documentation](docs/) • [🚀 Installation](docs/installation-guide.md) • [👨‍💻 Developer Guide](docs/developer-guide.md) • [📊 Progress](docs/features-status.md)

</div>