# Panduan Penggunaan Aplikasi E-Commerce

## Daftar Isi
1. [Pengenalan](#pengenalan)
2. [Registrasi dan Login](#registrasi-dan-login)
3. [Belanja Produk](#belanja-produk)
4. [Wishlist](#wishlist)
5. [Keranjang Belanja](#keranjang-belanja)
6. [Checkout dan Pembayaran](#checkout-dan-pembayaran)
7. [Mengelola Pesanan](#mengelola-pesanan)
8. [Profile dan Akun](#profile-dan-akun)
9. [Admin Panel](#admin-panel)

## Pengenalan

Aplikasi E-Commerce ini adalah platform jual beli online yang memungkinkan Anda untuk:
- Menjelajahi katalog produk dengan categories dropdown modern
- Menyimpan produk favorit dalam wishlist dengan heart icons
- Menambah produk ke keranjang belanja dengan preview dropdown
- Melakukan checkout dan pembayaran dengan multiple methods
- Melacak status pesanan secara real-time
- Mengelola profil akun dengan authentication modal

## Registrasi dan Login

### 🎯 Modern Authentication dengan Modal
Aplikasi menggunakan **modal authentication** yang modern dan user-friendly, tidak perlu redirect ke halaman terpisah.

### Cara Registrasi
1. Klik tombol **"Register"** di halaman utama
2. **Modal Register** akan muncul dengan features:
   - Form registrasi yang responsive
   - Real-time password validation dengan checklist requirements
   - Terms & Conditions modal dengan scroll agreement
   - Newsletter subscription option
   - Close button atau click outside untuk menutup
3. Isi form registrasi dengan:
   - **Nama lengkap**: Full name requirement
   - **Email address**: Valid email format
   - **Password**: Minimal 8 karakter dengan requirements:
     - At least 8 characters ✓
     - One uppercase letter ✓
     - One lowercase letter ✓
     - One number ✓
     - One special character ✓
   - **Konfirmasi password**: Must match original password
4. **Accept Terms**: Klik link untuk baca terms, centang agreement
5. Klik **"Create Account"** untuk membuat akun
6. Modal akan tertutup dan user langsung login

### Cara Login
1. Klik tombol **"Login"** di halaman utama atau saat perlu authentication
2. **Modal Login** akan muncul dengan features:
   - Responsive login form
   - Remember me option
   - Show/hide password toggle
   - Direct forgot password link
3. Masukkan email dan password
4. Optional: Centang "Remember me" untuk session yang lebih lama
5. Klik **"Sign In"** untuk masuk
6. Modal tertutup dan page refresh dengan user authenticated

### Lupa Password
1. Di modal login, klik **"Forgot your password?"**
2. Akan diarahkan ke halaman reset password
3. Masukkan email address Anda
4. Cek email untuk link reset password
5. Ikuti instruksi di email untuk reset password

### 🚀 Social Authentication (Coming Soon)
- **Google Login**: Disabled dengan "Coming Soon" label
- **Facebook Login**: Disabled dengan "Coming Soon" label
- Akan diaktifkan di update mendatang

### Modal Features
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Keyboard Navigation**: Tab navigation dan Enter/Escape shortcuts
- **Loading States**: Loading indicators saat processing
- **Error Handling**: Inline validation errors dengan clear messages
- **Auto-close**: Modal tertutup otomatis setelah sukses
- **Switch Modals**: Easy switch antara login dan register tanpa close

## Belanja Produk

### Menjelajahi Katalog
- **Halaman Utama**: Menampilkan semua produk dalam grid layout
- **Kategori**: Filter produk berdasarkan kategori
- **Detail Produk**: Klik produk untuk melihat informasi lengkap

### Informasi Produk
Setiap produk menampilkan:
- Nama produk
- Harga
- Kategori
- Deskripsi (di halaman detail)
- Stok tersedia
- Tombol "Tambah ke Keranjang"

### Menambah ke Keranjang
1. Di halaman produk, pilih quantity yang diinginkan
2. Klik tombol **"Tambah ke Keranjang"**
3. Produk akan ditambahkan ke session keranjang
4. Notifikasi konfirmasi akan muncul

## Wishlist

### 💝 Fitur Wishlist
Wishlist adalah fitur untuk menyimpan produk favorit Anda agar mudah diakses nanti. Fitur ini memungkinkan Anda untuk:
- Menyimpan produk yang ingin dibeli di masa depan
- Membandingkan produk yang disukai
- Melacak produk yang sedang dipertimbangkan
- Berbagi daftar keinginan dengan orang lain

### ❤️ Heart Icons pada Product Cards
- **Heart Icon**: Setiap product card memiliki heart icon di pojok kanan atas
- **Visual States**: 
  - **Empty Heart**: Produk belum di-wishlist (gray color)
  - **Filled Heart**: Produk sudah di-wishlist (red color with fill)
- **Hover Effects**: Heart icon berubah warna saat di-hover
- **Animation**: Smooth scale animation saat di-hover

### Menambah/Menghapus dari Wishlist
1. **Untuk User yang Sudah Login**:
   - Klik heart icon pada produk yang diinginkan
   - Icon akan berubah dari empty menjadi filled (atau sebaliknya)
   - Toast notification akan muncul: "Added to wishlist" atau "Removed from wishlist"
   - Perubahan tersimpan secara real-time

2. **Untuk User yang Belum Login**:
   - Klik heart icon akan memunculkan modal login
   - Login terlebih dahulu untuk menggunakan fitur wishlist
   - Setelah login, dapat langsung menggunakan wishlist

### 🏠 Wishlist Icon di Header
- **Wishlist Icon**: Heart icon di navigation header (hanya untuk user yang sudah login)
- **Count Badge**: Menampilkan jumlah item dalam wishlist dengan red badge
- **Visual States**: 
  - Empty heart jika wishlist kosong
  - Filled red heart dengan count jika ada item
- **Link**: Klik untuk langsung ke halaman wishlist

### 📱 Halaman Wishlist
Akses melalui wishlist icon di header atau direct URL `/wishlist`

#### Jika Wishlist Kosong:
- **Empty State**: Design yang user-friendly dengan heart icon besar
- **Message**: "Your wishlist is empty" dengan penjelasan
- **Call to Action**: "Browse Products" button untuk mulai berbelanja
- **Guidance**: Tips tentang cara menggunakan wishlist

#### Jika Ada Item dalam Wishlist:
- **Product Grid**: Layout grid responsif menampilkan produk tersimpan
- **Product Cards**: Setiap card menampilkan:
  - Gambar produk dengan hover effects
  - Nama produk (clickable ke detail page)
  - Kategori dengan badge
  - Harga dengan format IDR
  - Stock status dan informasi stok
  - Heart icon untuk remove dari wishlist
  - "Add to Cart" button untuk langsung beli
  - "View" button untuk ke detail produk

#### Features di Halaman Wishlist:
- **Product Count**: Header menampilkan jumlah item
- **Quick Actions**:
  - Add to Cart langsung dari wishlist
  - Remove dari wishlist dengan heart icon
  - View detail produk
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Stock Indicators**: 
  - "Only X left" badge untuk stock terbatas
  - "Out of Stock" overlay jika habis
- **Continue Shopping**: Section untuk browse produk lain

### Toast Notifications
- **Added to Wishlist**: Toast hijau dengan checkmark icon
- **Removed from Wishlist**: Toast abu-abu dengan heart icon
- **Login Required**: Toast biru dengan lock icon jika belum login
- **Auto Dismiss**: Toast otomatis hilang setelah 3-4 detik
- **Smooth Animation**: Slide in dari kanan, slide out ke kanan

### Technical Features
- **Real-time Updates**: Wishlist count update langsung setelah add/remove
- **Session Persistence**: Wishlist tersimpan di database per user
- **Performance**: Optimized loading dan smooth animations
- **Error Handling**: Proper error messages jika terjadi masalah
- **Accessibility**: Keyboard navigation dan screen reader support

## Keranjang Belanja

### 🛒 Cart Icon & Quick Access
- **Cart Icon di Navigation**: Icon keranjang dengan badge jumlah item
- **Dropdown Preview**: Hover/klik icon untuk preview keranjang
- **Quick Actions**: Hapus item langsung dari dropdown
- **Item Count**: Badge menampilkan total jumlah item

### Mengakses Keranjang
- **Via Cart Icon**: Klik icon keranjang di navigation bar
- **Via Dropdown**: Klik "View Cart" dari dropdown preview
- **Via Link**: Klik link "Keranjang" di navigation (authenticated users)

### 🎨 Modern Cart Interface
- **Responsive Design**: Tampilan optimal di desktop dan mobile
- **Professional Layout**: Grid layout dengan order summary sidebar
- **Visual Product Cards**: Card design dengan gambar produk
- **Smooth Animations**: Hover effects dan smooth transitions

### Mengelola Keranjang
- **Update Quantity**: 
  - Gunakan tombol +/- untuk adjusting quantity
  - Input langsung dengan number field
  - Auto-update dengan loading indicator
- **Hapus Item**: 
  - Tombol hapus dengan icon trash
  - Konfirmasi loading state
  - Update otomatis setelah penghapusan
- **Lihat Total**: 
  - Order summary sidebar dengan breakdown
  - Format mata uang IDR
  - Informasi shipping gratis

### 📋 Order Summary Features
- **Item Count**: Jumlah total item di keranjang
- **Subtotal**: Total harga sebelum ongkir
- **Shipping Info**: "Free Shipping" indicator
- **Grand Total**: Total akhir dengan format IDR
- **Trust Badges**: Security, shipping, dan return policy info

### Authentication-Aware Features
- **For Authenticated Users**: Direct checkout button
- **For Guest Users**: Sign in to checkout dengan link registrasi
- **Seamless Experience**: Cart persist across login/logout

### Empty Cart State
- **Friendly Message**: User-friendly empty cart illustration
- **Call to Action**: "Continue Shopping" button
- **Visual Design**: Professional empty state dengan icon

### Informasi di Keranjang
- Daftar semua produk dalam card format
- Product images dengan placeholder
- Quantity controls dengan +/- buttons
- Harga per item dan subtotal per produk
- Total keseluruhan dengan breakdown
- Loading states untuk semua interactions
- Professional error handling

## Checkout dan Pembayaran

### Proses Checkout
1. **Login Required**: Harus login terlebih dahulu
2. **Isi Alamat Pengiriman**:
   - Nama penerima
   - Nomor telepon
   - Alamat lengkap
   - Pilih kota dari dropdown (RajaOngkir integration)
   - Kode pos

3. **Pilih Metode Pengiriman**:
   - Klik "Cek Ongkos Kirim" setelah isi alamat
   - Pilih kurir (JNE, TIKI, POS) dengan estimasi real-time
   - Lihat biaya kirim aktual dari RajaOngkir API
   - Pilih service yang sesuai budget dan timeline

4. **Review Pesanan**:
   - Cek semua item di keranjang
   - Pastikan alamat pengiriman benar
   - Lihat total pembayaran (subtotal + ongkir real-time)

5. **Buat Pesanan**:
   - Klik "Buat Pesanan"
   - Sistem akan memproses pesanan dan mengarahkan ke halaman pembayaran

### 💳 Sistem Pembayaran Modern
Setelah membuat pesanan, Anda akan diarahkan ke halaman pembayaran dengan fitur lengkap.

#### 🕐 Payment Countdown Timer
- **24-Hour Timer**: Countdown real-time untuk batas waktu pembayaran
- **Visual Indicators**: 
  - Hijau: Waktu masih banyak (>6 jam)
  - Kuning: Waktu terbatas (2-6 jam)
  - Merah: Hampir expired (<2 jam)
- **Auto Redirect**: Otomatis redirect ke expired page jika waktu habis

#### 💰 Metode Pembayaran Lengkap
**E-Wallets (Prioritas Utama):**
- 🟢 **GoPay** - Bayar dengan saldo GoPay atau QRIS
- 🔵 **DANA** - Transfer via DANA app
- 🟠 **ShopeePay** - Bayar dengan ShopeePay
- 🔴 **LinkAja** - Transfer dengan LinkAja
- 🟡 **OVO** - Bayar dengan OVO

**Bank Transfer (Virtual Account):**
- 🏦 **BCA Virtual Account** - Transfer ke VA BCA
- 🏦 **BNI Virtual Account** - Transfer ke VA BNI  
- 🏦 **BRI Virtual Account** - Transfer ke VA BRI
- 🏦 **Mandiri Bill Payment** - Bayar via Mandiri

**Lainnya:**
- 📱 **QRIS** - Universal QR Code payment
- 💳 **Credit Card** - Visa, MasterCard, JCB
- 🏪 **Convenience Store** - Indomaret, Alfamart

#### 📋 Payment Instructions
**Fitur Copy yang Modern:**
- **Copy Buttons**: Copy nomor VA, kode pembayaran, dll dengan satu klik
- **Toast Notifications**: Feedback modern "berhasil disalin! 📋"
- **Browser Compatibility**: Fallback untuk browser lama
- **Visual Feedback**: Icon berubah saat berhasil copy

**Instruksi Detail:**
- **QR Code**: Tampilan QR code untuk scan pembayaran
- **Virtual Account**: Nomor VA dengan copy button
- **Payment Code**: Kode pembayaran untuk convenience store
- **Step-by-step**: Panduan langkah pembayaran
- **Important Notes**: Catatan penting dan tips

#### ⏰ Payment Expiration Handling
**Jika Pembayaran Expired:**
- **Automatic Detection**: Sistem deteksi otomatis payment expired
- **Expired Page**: Halaman khusus dengan penjelasan clear
- **Recovery Options**: 
  - Create new payment untuk order yang sama
  - Back to checkout untuk ubah alamat/metode
  - Contact support untuk bantuan
- **Clean Status**: Order dan payment status otomatis update ke "expired"

**Background Processing:**
- **Automated Cleanup**: Background job membersihkan expired payments
- **Scheduled Tasks**: Berjalan otomatis setiap periode tertentu
- **System Maintenance**: Menjaga database tetap clean

#### 🔄 Payment Status Tracking
- **Real-time Updates**: Status payment update otomatis
- **Manual Check**: Button "Check Payment Status" untuk sync manual
- **Status Indicators**: Visual badge untuk setiap status payment
- **Order Integration**: Status order update sesuai payment status

### 🎉 Payment Success Flow
**Setelah Pembayaran Berhasil:**
1. **Success Page**: Halaman konfirmasi dengan detail order
2. **Order Updates**: Status order otomatis update ke "confirmed"
3. **Payment Confirmation**: Status payment update ke "settlement"
4. **Email Notification**: (Coming soon) Email konfirmasi pembayaran
5. **Order Tracking**: Bisa track order di "Pesanan Saya"

## Mengelola Pesanan

### Melihat Daftar Pesanan
1. Login ke akun Anda
2. Klik **"Pesanan Saya"** di navigation
3. Akan muncul daftar semua pesanan Anda

### Informasi di Daftar Pesanan
- Nomor pesanan (format: ORD-XXXXXXXX)
- Tanggal pemesanan
- Status pesanan (Pending, Confirmed, Processing, Shipped, Delivered)
- Preview 3 produk pertama
- Total pembayaran
- Tombol "Lihat Detail"

### Detail Pesanan
Klik "Lihat Detail" untuk melihat:

**Informasi Umum**:
- Nomor pesanan
- Tanggal dan waktu pemesanan
- Status terkini

**Produk yang Dipesan**:
- Daftar lengkap semua produk
- Quantity dan harga per item
- Subtotal per produk

**Ringkasan Biaya**:
- Subtotal produk
- Ongkos kirim
- Total pembayaran

**Alamat Pengiriman**:
- Nama dan nomor telepon penerima
- Alamat lengkap pengiriman

**Status Pembayaran**:
- Status pembayaran (Lunas/Pending)
- Metode pembayaran
- ID transaksi (jika ada)

**Timeline Pesanan**:
- Riwayat status pesanan
- Tanggal setiap perubahan status

### Status Pesanan
- **Pending**: Pesanan baru dibuat, menunggu konfirmasi
- **Confirmed**: Pesanan dikonfirmasi, akan diproses
- **Processing**: Pesanan sedang diproses/dikemas
- **Shipped**: Pesanan sudah dikirim
- **Delivered**: Pesanan sudah sampai
- **Cancelled**: Pesanan dibatalkan

## Profile dan Akun

### Mengelola Profile
1. Klik nama Anda di navigation
2. Pilih **"Profile"** dari dropdown
3. Edit informasi yang ingin diubah:
   - Nama
   - Email
   - Password

### Update Informasi
- **Nama dan Email**: Isi form dan klik "Save"
- **Password**: Masukkan password lama dan password baru
- **Hapus Akun**: Tersedia opsi untuk menghapus akun

### Logout
- Klik nama Anda di navigation
- Pilih **"Log Out"** dari dropdown

## Admin Panel

### Akses Admin Panel
**Hanya untuk pengguna dengan role admin**

1. Login dengan akun admin
2. Klik nama Anda di navigation
3. Pilih **"Admin Panel"** dari dropdown
4. Atau akses langsung di `/admin`

### Default Admin Account
- **Email:** admin@ecommerce.com
- **Password:** admin123

### Fitur Admin Panel

#### Dashboard Admin
- **Statistics Overview:** Total users, products, orders, pending orders
- **Recent Orders:** 5 pesanan terbaru dengan detail
- **Quick Navigation:** Menu ke Products, Categories, Orders, Users

#### Navigation
- **Dashboard:** Overview statistics
- **Products:** Product management (CRUD operations) ✅
- **Categories:** Category management (CRUD operations) ✅  
- **Orders:** Order management dengan advanced filtering ✅
- **Users:** User management dengan role control ✅
- **Back to Store:** Kembali ke frontend store

#### Security Features
- **Role-based Access:** Hanya admin yang bisa akses
- **Admin Verification:** Additional security layer
- **Automatic Redirect:** Guest diarahkan ke login
- **403 Error:** Customer tidak bisa akses admin area

### Cara Menggunakan Admin Panel

#### Melihat Statistics
1. Login sebagai admin
2. Akses admin panel
3. Dashboard menampilkan:
   - Total customers
   - Total products
   - Total orders
   - Pending orders yang perlu diproses

#### Melihat Recent Orders
1. Di dashboard admin, scroll ke "Recent Orders"
2. Table menampilkan:
   - Order number
   - Customer name
   - Number of items
   - Total amount
   - Order status
   - Order date

#### Navigation Tips
- **Professional Design:** Clean admin interface
- **Back to Store:** Easy switch antara admin dan customer view
- **Responsive:** Works on mobile dan desktop
- **Admin Badge:** Clear indication you're in admin mode

### Product Management (Admin)

#### Mengakses Product Management
1. Login sebagai admin
2. Akses admin panel (/admin)
3. Klik menu **"Products"** di navigation
4. Akan masuk ke halaman product listing

#### Melihat Daftar Produk
**Halaman Products Index** menampilkan:
- **Table View:** Daftar semua produk dalam format table
- **Product Info:** Nama, kategori, harga, stok per produk
- **Stock Status:** Visual indicator (In Stock/Low Stock/Out of Stock)
- **Actions:** View, Edit, Delete buttons per produk
- **Pagination:** Navigation untuk produk banyak

#### Mencari dan Filter Produk
**Search Features:**
- **Search Box:** Cari berdasarkan nama atau deskripsi produk
- **Category Filter:** Filter produk berdasarkan kategori
- **Combined Search:** Bisa kombinasi search text + category filter
- **Clear Filters:** Button untuk reset semua filter

**Cara Menggunakan:**
1. Ketik kata kunci di search box
2. Pilih kategori dari dropdown (optional)
3. Klik "Search" untuk apply filter
4. Klik "Clear" untuk reset filter

#### Menambah Produk Baru
1. **Di halaman Products**, klik **"Add New Product"**
2. **Isi Form:**
   - **Product Name:** Nama produk (required)
   - **Category:** Pilih dari dropdown (required)
   - **Price:** Harga dalam IDR (required)
   - **Stock:** Jumlah stok (required)
   - **Description:** Deskripsi produk (optional)
3. **Validasi:** Form akan validasi input otomatis
4. **Submit:** Klik "Create Product"
5. **Success:** Redirect ke product listing dengan success message

#### Melihat Detail Produk
1. **Di product listing**, klik **"View"** pada produk
2. **Product Detail Page** menampilkan:
   - **Basic Information:** Nama, kategori, slug, deskripsi
   - **Pricing & Inventory:** Harga, stok, stock value total
   - **Product Metadata:** ID, created date, last updated
   - **Actions:** Edit, View in Store, Create Similar, Delete

#### Mengedit Produk
1. **Di product listing/detail**, klik **"Edit"**
2. **Form Pre-filled:** Semua data existing sudah terisi
3. **Edit Fields:** Ubah field yang perlu diupdate
4. **Product Info Box:** Menampilkan ID, slug, created/updated date
5. **Submit:** Klik "Update Product"
6. **Auto Slug:** Slug otomatis update jika nama berubah

#### Menghapus Produk
**Soft Delete System:**
- **Delete Button:** Available di product listing dan detail page
- **Confirmation:** Popup konfirmasi sebelum delete
- **Soft Delete:** Produk di-archive, tidak hilang permanent
- **Orders Preserved:** Order yang sudah ada tidak terpengaruh

**Cara Delete:**
1. Klik "Delete" button
2. Confirm di popup dialog
3. Produk akan dihapus dari listing
4. Data masih tersimpan di database (soft delete)

#### Tips Product Management
**Best Practices:**
- **Stock Management:** Update stok secara regular
- **Descriptive Names:** Gunakan nama produk yang jelas
- **Proper Categories:** Assign kategori yang sesuai
- **Competitive Pricing:** Set harga yang kompetitif
- **Regular Updates:** Update info produk secara berkala

**Security & Validation:**
- **Admin Only:** Hanya admin yang bisa akses
- **Form Validation:** Semua input di-validate
- **Error Handling:** Clear error messages
- **Success Feedback:** Confirmation untuk setiap action

**Performance Features:**
- **Pagination:** Handle banyak produk
- **Search & Filter:** Quick access ke produk specific
- **Responsive Design:** Works di semua devices
- **Professional UI:** Clean, modern interface

### Category Management (Admin) ✅

#### Mengakses Category Management
1. Login sebagai admin
2. Akses admin panel (/admin)
3. Klik menu **"Categories"** di navigation
4. Akan masuk ke halaman category listing

#### Fitur Category Management
**Yang Sudah Tersedia:**
- ✅ **Daftar Kategori:** View semua kategori dengan search & pagination
- ✅ **Tambah Kategori:** Create kategori baru dengan form validation
- ✅ **Edit Kategori:** Update kategori existing
- ✅ **Detail Kategori:** View detail dengan product count
- ✅ **Delete Protection:** Tidak bisa delete kategori yang memiliki produk
- ✅ **Search Function:** Cari kategori berdasarkan nama/deskripsi

### Order Management (Admin) ✅

#### Mengakses Order Management
1. Login sebagai admin
2. Akses admin panel (/admin)
3. Klik menu **"Orders"** di navigation
4. Akan masuk ke halaman order listing

#### Fitur Order Management
**Yang Sudah Tersedia:**
- ✅ **Advanced Filtering:** Search by order number, customer name, status, date range
- ✅ **Order Details:** View comprehensive order information
- ✅ **Status Updates:** Update order status (pending → processing → shipped → completed)
- ✅ **Customer Info:** Display customer contact & shipping details
- ✅ **CSV Export:** Export order data untuk reporting
- ✅ **Professional Interface:** Clean, responsive design

### User Management (Admin) ✅

#### Mengakses User Management
1. Login sebagai admin
2. Akses admin panel (/admin)
3. Klik menu **"Users"** di navigation
4. Akan masuk ke halaman user listing

#### Fitur User Management
**Yang Sudah Tersedia:**
- ✅ **User Listing:** Daftar semua users dengan filtering (role, status, date range)
- ✅ **Create Users:** Buat user baru dengan role assignment
- ✅ **Edit Users:** Update user info, role, dan password
- ✅ **User Details:** View comprehensive user info dengan order history
- ✅ **Status Toggle:** Activate/deactivate user accounts
- ✅ **Security Features:** Tidak bisa delete/deactivate diri sendiri
- ✅ **Order Protection:** Tidak bisa delete user yang memiliki orders

## Tips Penggunaan

### Keamanan
- Gunakan password yang kuat
- Jangan share login credentials
- Logout setelah selesai berbelanja
- Periksa alamat email konfirmasi

### Berbelanja
- Cek stok sebelum checkout
- Pastikan alamat pengiriman akurat
- Simpan nomor pesanan untuk referensi
- Hubungi customer service jika ada masalah

### Troubleshooting
- **Tidak bisa login**: Cek email/password, gunakan forgot password
- **Produk hilang dari keranjang**: Keranjang disimpan di session browser
- **Error saat checkout**: Pastikan semua field terisi dan pilih pengiriman
- **Pesanan tidak muncul**: Refresh halaman atau cek koneksi internet

## Kontak Support

Jika mengalami masalah atau butuh bantuan:
- Email: support@ecommerce.com
- Telepon: 021-XXXXXXX
- Jam operasional: Senin-Jumat 09:00-17:00 WIB

---

*Dokumentasi ini akan terus diperbarui seiring dengan pengembangan fitur baru.*