# Fitur dan Teknologi Proyek Website E-Commerce

Proyek pengembangan website e-commerce ini akan menggunakan teknologi modern dan mencakup berbagai fitur esensial untuk platform jual beli online yang komprehensif.

### I. Fitur Website

#### A. Fitur Website Utama

- **Desain Modern & Responsif:** Tampilan website akan dirancang modern dan dapat beradaptasi dengan baik di berbagai ukuran layar (desktop, tablet, _smartphone_).
- **Tampilan HTML+CSS Native:** Layout dan styling akan dikembangkan secara native menggunakan HTML dan CSS untuk performa yang optimal dan kustomisasi penuh.
- **Optimasi SEO Dasar & Google Analytics:** Implementasi dasar untuk optimasi mesin pencari dan integrasi Google Analytics untuk pelacakan performa website.

#### B. Fitur Pengguna

- **Sistem Login/Daftar Pengguna:** Memungkinkan pengguna untuk membuat akun dan login untuk mengakses fitur personalisasi.
- **Halaman "My Orders":** Pengguna dapat melihat riwayat pesanan mereka, termasuk status tracking pengiriman.
- **Notifikasi Email:** Sistem akan mengirimkan email otomatis untuk konfirmasi order, pembayaran, dan status pengiriman.

#### C. Konten Website (Produk & Katalog)

- **Beranda + Kategori Produk:** Halaman utama akan menampilkan banner, daftar kategori produk dengan opsi filter (harga, kategori, dll.) untuk memudahkan navigasi.
- **Halaman Katalog Produk:** Menampilkan daftar produk dalam format grid dengan fitur pencarian dan filter Produk.
- **Halaman Detail Produk:** Menampilkan informasi lengkap produk, termasuk gambar, pilihan varian (ukuran/warna), deskripsi, stok, dan harga.

#### D. Proses Transaksi

- **Keranjang & Checkout:** Pengguna dapat menambah, memperbarui jumlah, dan menghapus item di keranjang belanja.
- **Cek Ongkir:** Integrasi dengan API kurir untuk pengecekan ongkos kirim berdasarkan lokasi.
- **Pilihan Kurir & Metode Pengiriman:** Pengguna dapat memilih kurir dan metode pengiriman yang diinginkan saat checkout.
- **Pembayaran via Midtrans Snap:** Integrasi penuh dengan Midtrans Snap API untuk proses pembayaran yang mulus, termasuk callback dan notifikasi pembayaran.
- **Metode Pembayaran Lain:** Mendukung integrasi metode pembayaran lain seperti Transfer Bank, e-Wallet, dan QRIS.

#### E. Manajemen Admin

- **Dashboard Admin:** Panel kontrol khusus untuk administrator dalam mengelola seluruh aspek website.
- **CRUD Produk, Kategori, Pesanan:** Administrator dapat membuat, membaca, memperbarui, dan menghapus data produk, kategori, dan pesanan.
- **Laporan Pesanan & Status Pembayaran/Pengiriman:** Fitur pelaporan untuk memantau status pesanan, pembayaran, dan pengiriman.

### II. Teknologi & Integrasi

- **Backend:** Laravel 10 (menggunakan arsitektur MVC dan Blade template engine).
- **Frontend:** React.js, untuk membangun antarmuka pengguna yang dinamis dan interaktif.
- **Database:** MySQL, sebagai sistem manajemen database relasional.
- **Integrasi Kurir:** JNE API, JNT API, dan API kurir lainnya untuk cek ongkir dan fitur terkait pengiriman.
- **Integrasi Payment Gateway:** Midtrans Snap API.
- **Layanan Email:** SMTP / Mailgun untuk pengiriman notifikasi email.
