

Tentu, berdasarkan use case diagram yang Anda berikan, saya akan membuatkan spesifikasi koding yang terstruktur. Dokumen ini akan menjadi panduan bagi tim pengembang untuk membangun "Sistem Pengelolaan Inventaris Alat Laboratorium".

---

### **Spesifikasi Koding: Sistem Pengelolaan Inventaris Alat Laboratorium**

**Versi:** 1.0
**Tanggal:** 26 Mei 2024

---

#### **1. Pendahuluan**

**1.1. Tujuan Dokumen**
Dokumen ini bertujuan untuk memberikan panduan teknis terperinci bagi tim pengembang dalam membangun Sistem Pengelolaan Inventaris Alat Laboratorium. Spesifikasi ini mencakup arsitektur sistem, spesifikasi use case, desain basis data, spesifikasi API, dan aspek keamanan yang harus diimplementasikan.

**1.2. Ruang Lingkup Sistem**
Sistem ini akan mengelola seluruh siklus hidup inventaris alat laboratorium, mulai dari pendaftaran alat, peminjaman, pengembalian, hingga pelaporan. Sistem ini memiliki tiga peran utama: Administrator Sistem, Petugas Laboratorium, dan Peminjam.

**1.3. Definisi dan Akronim**
*   **Admin:** Administrator Sistem
*   **Petugas:** Petugas Laboratorium
*   **Peminjam:** Pengguna yang meminjam alat (dapat berupa mahasiswa, dosen, atau peneliti).
*   **Inventaris:** Daftar alat dan perlengkapan laboratorium.
*   **Transaksi:** Proses peminjaman dan pengembalian alat.

---

#### **2. Arsitektur Sistem**

Sistem akan dikembangkan dengan arsitektur **Web-based Application** menggunakan pola **Model-View-Controller (MVC)** untuk memisahkan logika bisnis, antarmuka pengguna, dan pengelolaan data.

*   **Frontend:** Framework modern seperti React.js atau Vue.js untuk membangun antarmuka pengguna yang interaktif dan responsif.
*   **Backend:** Framework berbasis Node.js (Express.js), Python (Django/Flask), atau PHP (Laravel) untuk menangani logika bisnis, autentikasi, dan API.
*   **Basis Data:** Sistem manajemen basis data relasional seperti PostgreSQL atau MySQL untuk menyimpan data pengguna, inventaris, dan transaksi.
*   **Autentikasi:** Menggunakan JSON Web Token (JWT) untuk mengelola sesi pengguna.

---

#### **3. Spesifikasi Use Case**

Berikut adalah detail spesifikasi untuk setiap use case utama.

**3.1. Use Case: Login**
*   **ID:** UC-01
*   **Aktor:** Administrator Sistem, Petugas Laboratorium, Peminjam
*   **Deskripsi:** Aktor memasukkan kredensial (username/password) untuk mengakses sistem sesuai perannya.
*   **Prakondisi:** Aktor telah memiliki akun yang terdaftar di sistem.
*   **Alur Normal:**
    1.  Aktor membuka halaman login.
    2.  Aktor memasukkan username dan password.
    3.  Sistem memvalidasi kredensial.
    4.  Jika valid, sistem menghasilkan token autentikasi (JWT).
    5.  Sistem mengarahkan aktor ke dashboard sesuai perannya (Admin, Petugas, atau Peminjam).
*   **Alur Pengecualian:**
    1.  Pada langkah 3, jika kredensial tidak valid, sistem menampilkan pesan error "Username atau Password salah".
    2.  Pada langkah 3, jika akun aktor tidak aktif, sistem menampilkan pesan "Akun Anda dinonaktifkan. Silakan hubungi admin."
*   **Postkondisi:** Aktor berhasil masuk ke sistem dan diarahkan ke halaman utama.

**3.2. Use Case: Manajemen Pengguna**
*   **ID:** UC-02
*   **Aktor:** Administrator Sistem
*   **Deskripsi:** Admin mengelola data pengguna (buat, edit, hapus) dan menetapkan peran (Petugas atau Peminjam).
*   **Prakondisi:** Admin telah login (UC-01).
*   **Alur Normal:**
    1.  Admin mengakses menu "Manajemen Pengguna".
    2.  Sistem menampilkan daftar semua pengguna dalam bentuk tabel.
    3.  Admin dapat memilih untuk menambah pengguna baru.
    4.  Admin mengisi form (nama, username, email, peran, password).
    5.  Sistem menyimpan data pengguna baru.
    6.  Admin dapat memilih untuk mengedit data pengguna yang ada.
    7.  Admin mengubah data pada form dan menyimpan perubahan.
    8.  Admin dapat memilih untuk menghapus pengguna.
    9.  Sistem meminta konfirmasi sebelum menghapus.
*   **Alur Pengecualian:**
    1.  Pada langkah 5, jika username atau email sudah terdaftar, sistem menampilkan pesan error.
*   **Postkondisi:** Data pengguna berhasil diperbarui (ditambah, diubah, atau dihapus).

**3.3. Use Case: Manajemen Inventaris**
*   **ID:** UC-03
*   **Aktor:** Administrator Sistem, Petugas Laboratorium
*   **Deskripsi:** Aktor mengelola data alat laboratorium (tambah, edit, hapus, perbarui status).
*   **Prakondisi:** Aktor (Admin/Petugas) telah login (UC-01).
*   **Alur Normal:**
    1.  Aktor mengakses menu "Manajemen Inventaris".
    2.  Sistem menampilkan daftar semua alat beserta statusnya (Tersedia, Dipinjam, Dalam Perbaikan).
    3.  Aktor menambah alat baru dengan mengisi form (nama alat, kode, kategori, deskripsi, jumlah, lokasi).
    4.  Sistem menyimpan data alat baru.
    5.  Aktor dapat mengedit detail alat yang ada.
    6.  Aktor dapat memperbarui status alat (misalnya, dari "Tersedia" menjadi "Dalam Perbaikan").
*   **Postkondisi:** Data inventaris berhasil diperbarui.

**3.4. Use Case: Manajemen Transaksi**
*   **ID:** UC-04
*   **Aktor:** Petugas Laboratorium
*   **Deskripsi:** Petugas memproses permintaan peminjaman dan mencatat pengembalian alat. Use case ini di-*extend* oleh `Peminjaman Alat` dan `Pengembalian Alat`.
*   **Prakondisi:** Petugas telah login (UC-01).
*   **Alur Normal (Memproses Peminjaman):**
    1.  Petugas mengakses menu "Transaksi".
    2.  Sistem menampilkan daftar permintaan peminjaman yang pending.
    3.  Petugas memilih satu permintaan.
    4.  Petugas memeriksa ketersediaan alat.
    5.  Jika tersedia, petugas menyetujui permintaan. Sistem mengubah status alat menjadi "Dipinjam" dan mencatat tanggal pinjam serta batas pengembalian.
    6.  Jika tidak tersedia, petugas menolak permintaan dengan memberikan alasan.
*   **Alur Normal (Memproses Pengembalian):**
    1.  Peminjam mengembalikan alat ke petugas.
    2.  Petugas mengakses menu "Transaksi" dan mencatat pengembalian.
    3.  Petugas memilih transaksi peminjaman yang bersangkutan.
    4.  Petugas memperbarui status transaksi menjadi "Dikembalikan" dan mencatat tanggal pengembalian.
    5.  Sistem mengubah status alat menjadi "Tersedia".
*   **Postkondisi:** Status transaksi dan inventaris diperbarui.

**3.5. Use Case: Peminjaman Alat**
*   **ID:** UC-05
*   **Aktor:** Peminjam
*   **Deskripsi:** Peminjam melihat daftar alat yang tersedia dan mengajukan permintaan peminjaman. Use case ini *extend* `Manajemen Transaksi`.
*   **Prakondisi:** Peminjam telah login (UC-01).
*   **Alur Normal:**
    1.  Peminjam mengakses halaman "Daftar Alat".
    2.  Sistem menampilkan alat-alat dengan status "Tersedia".
    3.  Peminjam memilih alat yang diinginkan.
    4.  Peminjam mengisi form peminjaman (tanggal pinjam, tanggal kembali, keperluan).
    5.  Peminjam mengajukan permintaan.
    6.  Sistem menyimpan permintaan dengan status "Menunggu Persetujuan".
*   **Postkondisi:** Permintaan peminjaman berhasil dibuat dan menunggu persetujuan Petugas.

**3.6. Use Case: Pembuatan Laporan**
*   **ID:** UC-06
*   **Aktor:** Administrator Sistem, Petugas Laboratorium
*   **Deskripsi:** Aktor membuat laporan terkait inventaris atau transaksi. Use case ini di-*include* oleh `Manajemen Inventaris` dan `Manajemen Transaksi`.
*   **Prakondisi:** Aktor (Admin/Petugas) telah login (UC-01).
*   **Alur Normal:**
    1.  Aktor mengakses menu "Laporan".
    2.  Aktor memilih jenis laporan (misal: "Laporan Stok Inventaris", "Laporan Transaksi Bulanan").
    3.  Aktor memilih filter (rentang tanggal, kategori alat, dll.).
    4.  Sistem menghasilkan laporan dalam format yang dapat dilihat di halaman dan diunduh (PDF/Excel).
*   **Postkondisi:** Laporan berhasil dibuat dan tersedia untuk diunduh.

---

#### **6. Keamanan**

*   **Password Hashing:** Semua password harus di-hash menggunakan algoritma yang kuat seperti **bcrypt** sebelum disimpan di basis data.
*   **Autentikasi & Autorisasi:** Implementasikan middleware untuk memvalidasi JWT pada setiap request yang dilindungi. Middleware juga harus memeriksa role pengguna untuk mengakses endpoint tertentu (Role-Based Access Control - RBAC).
*   **Validasi Input:** Semua data yang masuk dari pengguna (melalui form atau API) harus divalidasi dan disanitasi untuk mencegah serangan **SQL Injection** dan **Cross-Site Scripting (XSS)**.
*   **HTTPS:** Pastikan seluruh komunikasi klien-server menggunakan HTTPS untuk mengenkripsi data.

---

#### **7. Penutup**

Spesifikasi koding ini berfungsi sebagai fondasi awal pengembangan. Tim diharapkan dapat mengembangkan lebih detail lagi selama proses implementasi, seperti desain UI/UX yang lebih rinci, unit testing, dan integrasi sistem. Dokumen ini akan diperbarui seiring dengan perkembangan proyek.