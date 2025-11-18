# Daily Report & Monthly Report - File Structure

## Fitur yang Ditambahkan

Program sekarang mendukung:

1. **Generate Daily Report** - Hitung & simpan rata-rata per shift per hari
2. **Fetch Daily Report** - Ambil report untuk tanggal tertentu
3. **Fetch Monthly Report** - Ambil semua report dalam satu bulan (untuk tabel di frontend)
4. **Fetch All Reports** - Ambil semua historical reports

---

## File Baru yang Dibuat

### 1. Database Schema

**File**: `src/db/schema.ts`

- Tambahan: 4 tabel baru (`dailyReportLVMDP1`, `dailyReportLVMDP2`, `dailyReportLVMDP3`, `dailyReportLVMDP4`)
- Menyimpan: id, reportDate, shift1/2/3 count & averages, timestamps

**Migration SQL**: `drizzle/0002_create_daily_reports.sql`

---

### 2. LVMDP 1 - Daily Report Files

```
src/lvmdp/LVMDP_1/
├── lvmdp_1.dailyReport.repository.ts
│   ├── saveDailyReport()
│   ├── getDailyReportByDate()
│   ├── getDailyReportByMonth()
│   └── getAllDailyReports()
├── lvmdp_1.dailyReport.services.ts
│   ├── generateAndSaveDailyReport()
│   ├── fetchDailyReport()
│   ├── fetchMonthlyReport()
│   └── fetchAllDailyReports()
└── lvmdp_1.dailyReport.controller.ts
    └── Routes:
        ├── POST /generate?date=YYYY-MM-DD
        ├── GET /:date
        ├── GET /monthly/:year/:month
        └── GET /all
```

### 3. LVMDP 2, 3, 4 - Daily Report Files

Sama seperti LVMDP 1, tapi untuk:

- `lvmdp_2.dailyReport.*`
- `lvmdp_3.dailyReport.*`
- `lvmdp_4.dailyReport.*`

---

## API Endpoints

### LVMDP 1

- `POST /api/lvmdp1/daily-report/generate?date=YYYY-MM-DD`
- `GET /api/lvmdp1/daily-report/:date`
- `GET /api/lvmdp1/daily-report/monthly/:year/:month`
- `GET /api/lvmdp1/daily-report/all`

### LVMDP 2, 3, 4

Sama dengan mengganti `lvmdp1` → `lvmdp2/3/4`

---

## Contoh Penggunaan

### 1. Generate Report untuk Hari Ini

```bash
curl -X POST http://localhost:2000/api/lvmdp1/daily-report/generate
```

### 2. Generate Report untuk Tanggal Spesifik

```bash
curl -X POST "http://localhost:2000/api/lvmdp1/daily-report/generate?date=2025-11-15"
```

### 3. Fetch Report 1 Bulan (untuk tabel frontend)

```bash
curl http://localhost:2000/api/lvmdp1/daily-report/monthly/2025/11
```

Response = Array berisi 30 hari (jika ada) dengan struktur:

```json
[
  {
    "reportDate": "2025-11-01",
    "shift1Count": 42,
    "shift1AvgKwh": 402.0123,
    "shift1AvgCurrent": 232.0035,
    "shift2Count": 45,
    "shift2AvgKwh": 410.0456,
    "shift2AvgCurrent": 235.1234,
    "shift3Count": 38,
    "shift3AvgKwh": 395.0789,
    "shift3AvgCurrent": 228.5678
    // ... dst
  }
  // ... lebih banyak hari
]
```

---

## Data Flow

```
Raw Data (v_lvmdp_1 view)
    ↓
generateAndSaveDailyReport(dateStr)
    ↓
Filter berdasarkan Shift:
  - Shift 1: 07:01 - 14:30
  - Shift 2: 14:31 - 22:00
  - Shift 3: 22:01 - 07:00 (+1 hari)
    ↓
Hitung Rata-rata (avg kWh, avg current) per shift
    ↓
Simpan ke database (daily_report_lvmdp_1)
    ↓
Frontend fetch monthly/daily → render di tabel
```

---

## Database Update Strategy

Menggunakan `onConflictDoUpdate`:

- Jika `reportDate` sudah ada → UPDATE dengan nilai terbaru
- Jika `reportDate` baru → INSERT baru

Jadi aman untuk generate report berkali-kali untuk tanggal yang sama!

---

## File yang Dimodifikasi

1. **src/db/schema.ts** - Tambah 4 tabel daily report
2. **src/index.ts** - Register 8 route baru (daily report untuk 4 LVMDP)

---

## Next Steps

1. Run migration:

   ```bash
   npm run drizzle:migrate
   ```

2. Start server:

   ```bash
   npm run dev
   ```

3. Generate report:

   ```bash
   curl -X POST "http://localhost:2000/api/lvmdp1/daily-report/generate?date=2025-11-15"
   ```

4. Fetch untuk frontend:

   ```bash
   curl "http://localhost:2000/api/lvmdp1/daily-report/monthly/2025/11"
   ```

5. Di frontend, render data ke tabel dengan struktur report!

---

## Catatan

- ✅ Setiap hari direset otomatis (nilai sebelumnya tidak ada, dihitung ulang)
- ✅ Shift 3 lintas hari ditangani dengan benar
- ✅ Bisa di-query per hari atau per bulan (perfect untuk tabel)
- ✅ Auto-update jika generate ulang hari yang sama
