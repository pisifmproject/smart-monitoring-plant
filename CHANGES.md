# Ringkasan Perubahan

Berikut adalah daftar file yang telah diubah, dihapus, atau ditambahkan selama proses migrasi modul Electrical.

## File yang Dihapus

- **`pisifmfe/frontend/src/views/electrical/`**
  - Seluruh direktori ini dihapus untuk menghilangkan UI Electrical yang lama.

- **`pisifmfe/frontend/src/views/lvmdp/`**
  - Direktori ini juga dihapus karena berisi implementasi LVMDP yang lama.

## File yang Dimodifikasi

- **`pisifmfe/frontend/src/router/index.ts`**
  - **Menghapus rute lama**: Semua rute yang terkait dengan modul Electrical lama (`/electrical` dan `/lvmdp/*`) telah dihapus.
  - **Menambahkan rute baru**: Menambahkan rute baru untuk Electrical Dashboard (`/plant/:plantId/electrical/panels`), LVMDP 1-4 (`/plant/:plantId/electrical/lvmdp/:id`), dan LVMDP Daily Report.

- **`pisifmfe/frontend/src/composables/useLvmdpLive.ts`**
  - **Implementasi Logika Data**: Fungsi `useLvmdpLive` sekarang menerima `plantId`.
  - Jika `plantId` adalah "CIKUPA", fungsi akan mengambil data _real_ dari backend.
  - Untuk `plantId` lainnya, fungsi akan menghasilkan data _dummy_ untuk ditampilkan di UI.

- **`pisifmfe/frontend/src/views/lvmdp/lvmdp1.vue`** (dan lvmdp2, lvmdp3, lvmdp4)
  - **Mengirim `plantId`**: Mengambil `plantId` dari parameter rute dan mengirimkannya ke `useLvmdpLive` untuk menentukan sumber data (real atau dummy).

- **`pisifmfe/frontend/src/components/sideBar.vue`** (sekarang `sideBarSimple.vue`)
  - **Struktur Menu Baru**: Mengganti menu "Utility" dengan menu "Electricity" sebagai menu utama.
  - Menambahkan _dropdown_ di bawah "Electricity" untuk LVMDP 1-4.
  - Mengarahkan tautan "Electricity" ke Electrical Dashboard.

- **`pisifmfe/frontend/src/layouts/dashboardLayout.vue`**
  - **Memperbaiki Impor Sidebar**: Memperbarui nama impor dari `sideBarSimple` menjadi `SideBar` agar sesuai dengan komponen yang benar.

- **`pisifmfe/frontend/src/stores/auth.ts`**
  - **Mengembalikan ke Versi Asli**: File ini dikembalikan ke versi aslinya untuk mengatasi masalah render aplikasi.

## File yang Ditambahkan (dari folder `reference`)

- **`pisifmfe/frontend/src/views/dailyReport/lvmdp/`**: Berisi komponen untuk LVMDP Daily Report.
- **`pisifmfe/frontend/src/views/lvmdp/`**: Berisi komponen baru untuk halaman LVMDP 1-4.
- **`pisifmfe/frontend/src/views/summary/`**: Berisi komponen untuk Electrical Dashboard (Summary).
- **Beberapa komponen, composables, dan file utilitas lainnya** dari folder `reference` disalin untuk mendukung fungsionalitas UI yang baru.
