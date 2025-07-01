# Panduan Penggunaan Aplikasi E-Commerce

## Daftar Isi
1. [Pengenalan](#pengenalan)
2. [Registrasi dan Login](#registrasi-dan-login)
3. [Belanja Produk](#belanja-produk)
4. [Keranjang Belanja](#keranjang-belanja)
5. [Checkout dan Pembayaran](#checkout-dan-pembayaran)
6. [Mengelola Pesanan](#mengelola-pesanan)
7. [Profile dan Akun](#profile-dan-akun)
8. [Admin Panel](#admin-panel)

## Pengenalan

Aplikasi E-Commerce ini adalah platform jual beli online yang memungkinkan Anda untuk:
- Menjelajahi katalog produk
- Menambah produk ke keranjang belanja
- Melakukan checkout dan pembayaran
- Melacak status pesanan
- Mengelola profil akun

## Registrasi dan Login

### Cara Registrasi
1. Klik tombol **"Register"** di halaman utama
2. Isi form registrasi dengan:
   - Nama lengkap
   - Email address
   - Password (minimal 8 karakter)
   - Konfirmasi password
3. Klik **"Register"** untuk membuat akun
4. Cek email untuk verifikasi akun (jika diperlukan)

### Cara Login
1. Klik tombol **"Login"** di halaman utama
2. Masukkan email dan password
3. Klik **"Log in"** untuk masuk
4. Anda akan diarahkan ke dashboard

### Lupa Password
1. Di halaman login, klik **"Forgot your password?"**
2. Masukkan email address Anda
3. Cek email untuk link reset password
4. Ikuti instruksi di email untuk reset password

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
   - Kota
   - Kode pos

3. **Pilih Metode Pengiriman**:
   - Klik "Cek Ongkos Kirim" setelah isi alamat
   - Pilih kurir dan metode pengiriman
   - Lihat estimasi biaya kirim

4. **Review Pesanan**:
   - Cek semua item di keranjang
   - Pastikan alamat pengiriman benar
   - Lihat total pembayaran (subtotal + ongkir)

5. **Buat Pesanan**:
   - Klik "Buat Pesanan"
   - Sistem akan memproses pesanan
   - Stok produk otomatis berkurang
   - Keranjang dikosongkan

### Validasi Checkout
- Semua field alamat harus diisi
- Metode pengiriman harus dipilih
- Stok produk harus mencukupi
- User harus login

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