# Panduan Instalasi E-Commerce Application

## Daftar Isi
1. [Persyaratan Sistem](#persyaratan-sistem)
2. [Instalasi Development](#instalasi-development)
3. [Konfigurasi Database](#konfigurasi-database)
4. [Setup Environment](#setup-environment)
5. [Menjalankan Aplikasi](#menjalankan-aplikasi)
6. [Troubleshooting](#troubleshooting)

## Persyaratan Sistem

### Minimum Requirements
- **PHP:** 8.2 atau lebih tinggi
- **Composer:** 2.0+
- **Node.js:** 18.0+
- **NPM:** 9.0+
- **Database:** SQLite (development) / MySQL 8.0+ (production)
- **Web Server:** Apache/Nginx (production)

### PHP Extensions Required
```bash
# Pastikan extensions berikut sudah aktif:
php -m | grep -E "(pdo|pdo_sqlite|pdo_mysql|mbstring|openssl|tokenizer|xml|ctype|json|bcmath|fileinfo)"
```

### Recommended Tools
- **Git:** untuk version control
- **VS Code:** dengan PHP dan Laravel extensions
- **Postman:** untuk API testing
- **MySQL Workbench:** untuk database management

## Instalasi Development

### 1. Clone Repository
```bash
# Clone project
git clone <repository-url>
cd e-commerce-mantap/app

# Atau jika sudah ada folder
cd /Users/jutioncandrakirana/Documents/MIPDEVP/e-commerce-mantap/app
```

### 2. Install PHP Dependencies
```bash
# Install Laravel dan dependencies
composer install

# Jika ada error permissions
sudo chown -R $USER:$USER .
chmod -R 755 storage bootstrap/cache
```

### 3. Install Node Dependencies
```bash
# Install frontend dependencies
npm install

# Jika ada error, coba:
npm cache clean --force
npm install
```

### 4. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Database Setup
```bash
# Create SQLite database (untuk development)
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed database dengan sample data
php artisan db:seed

# Seed admin user (optional)
php artisan db:seed --class=AdminUserSeeder
```

### 6. Build Frontend Assets
```bash
# Development build
npm run dev

# Production build
npm run build
```

## Konfigurasi Database

### SQLite (Development)
File `.env` untuk development:
```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
# DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD tidak perlu
```

### MySQL (Production)
File `.env` untuk production:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### Setup MySQL Database
```sql
-- Login ke MySQL
mysql -u root -p

-- Create database
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
```

## Setup Environment

### File .env Configuration
```env
# Application
APP_NAME="E-Commerce Mantap"
APP_ENV=local
APP_KEY=base64:xxx... # Generated by php artisan key:generate
APP_DEBUG=true
APP_TIMEZONE=Asia/Jakarta
APP_URL=http://localhost:8000

# Database (Development)
DB_CONNECTION=sqlite
DB_DATABASE=/path/to/your/project/database/database.sqlite

# Database (Production)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=ecommerce_db
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Cache
CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

# Mail (untuk production)
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

# Logging
LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# Broadcasting
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local

# Vite
VITE_APP_NAME="${APP_NAME}"
```

### Permissions Setup (Linux/Mac)
```bash
# Set correct permissions
sudo chown -R www-data:www-data /path/to/your/project
sudo chmod -R 755 /path/to/your/project
sudo chmod -R 775 /path/to/your/project/storage
sudo chmod -R 775 /path/to/your/project/bootstrap/cache
```

## Menjalankan Aplikasi

### Development Mode

#### Option 1: All-in-one command (Recommended)
```bash
# Start semua services sekaligus
composer dev

# Ini akan menjalankan:
# - Laravel development server (http://localhost:8000)
# - Queue worker
# - Real-time logs
# - Vite development server (untuk hot reload)
```

#### Option 2: Manual start individual services
```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Frontend development
npm run dev

# Terminal 3: Queue worker (jika perlu)
php artisan queue:listen

# Terminal 4: Logs (jika perlu)
php artisan pail
```

### Testing Installation
```bash
# Run tests
php artisan test

# Specific test
php artisan test --filter=ExampleTest

# Dengan coverage
php artisan test --coverage
```

### Accessing Application
- **Web Application:** http://localhost:8000
- **Vite Dev Server:** http://localhost:5173 (auto-proxied)

### Default Login Credentials
Setelah menjalankan AdminUserSeeder:

**Admin Account:**
- Email: `admin@ecommerce.com`
- Password: `admin123`
- Role: Admin (akses ke Admin Panel)

**Customer Account:**  
- Email: `customer@example.com`
- Password: `customer123`
- Role: Customer (akses customer features only)

Atau buat user baru melalui registration.

## Production Setup

### 1. Server Requirements
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install php8.2 php8.2-cli php8.2-common php8.2-mysql php8.2-zip php8.2-gd php8.2-mbstring php8.2-curl php8.2-xml php8.2-bcmath php8.2-sqlite3

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Production Environment
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database production settings
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=ecommerce_production
DB_USERNAME=production_user
DB_PASSWORD=secure_password

# Mail settings
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email@domain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
```

### 3. Production Build
```bash
# Install dependencies
composer install --optimize-autoloader --no-dev
npm ci --production

# Build assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force
```

### 4. Web Server Configuration

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/your-project/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### Apache Configuration
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/your-project/public

    <Directory /var/www/your-project/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

## Troubleshooting

### Common Issues

#### 1. Permission Errors
```bash
# Fix Laravel permissions
sudo chown -R $USER:www-data storage
sudo chown -R $USER:www-data bootstrap/cache
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

#### 2. Database Connection Error
```bash
# Check database file exists (SQLite)
ls -la database/database.sqlite

# Check MySQL connection
mysql -u username -p -h localhost database_name

# Recreate database file
rm database/database.sqlite
touch database/database.sqlite
php artisan migrate
```

#### 3. NPM/Node Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Update Node.js
nvm install 18
nvm use 18
```

#### 4. Composer Issues
```bash
# Update Composer
composer self-update

# Clear composer cache
composer clear-cache

# Reinstall dependencies
rm -rf vendor composer.lock
composer install
```

#### 5. Frontend Build Issues
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild assets
npm run build

# Check for missing assets
ls -la public/build/
```

#### 6. Laravel Errors
```bash
# Clear all caches
php artisan optimize:clear

# Regenerate key
php artisan key:generate

# Check logs
tail -f storage/logs/laravel.log
```

### Performance Optimization

#### Development
```bash
# Disable debug bar in production
composer remove barryvdh/laravel-debugbar --dev

# Optimize autoloader
composer dump-autoload --optimize
```

#### Production
```bash
# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Enable OPcache in php.ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
```

### Debugging Commands
```bash
# Check PHP version and extensions
php -v
php -m

# Check Composer version
composer --version

# Check Node/NPM version
node --version
npm --version

# Check Laravel status
php artisan about

# Test database connection
php artisan tinker
DB::connection()->getPdo();

# Check routes
php artisan route:list

# Check migrations status
php artisan migrate:status
```

## Backup dan Maintenance

### Regular Maintenance
```bash
# Update dependencies (careful in production)
composer update
npm update

# Clear logs
php artisan log:clear

# Optimize database
php artisan migrate:fresh --seed # ONLY in development!
```

### Backup
```bash
# Database backup (MySQL)
mysqldump -u username -p database_name > backup.sql

# Database backup (SQLite)
cp database/database.sqlite backup/database_backup_$(date +%Y%m%d).sqlite

# File backup
tar -czf backup_$(date +%Y%m%d).tar.gz /path/to/project
```

---

## Support

Jika mengalami masalah saat instalasi:

1. **Check logs:** `storage/logs/laravel.log`
2. **Run diagnostics:** `php artisan about`
3. **Check documentation:** Laravel, React, Inertia.js docs
4. **Community:** Stack Overflow, Laravel community

**Happy coding! 🚀**