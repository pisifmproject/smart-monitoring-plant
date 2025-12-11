# Fix Total kWh Calculation

## Masalah

Total kWh dalam daily report sebelumnya dihitung dengan cara yang salah. Data `real_power` (dalam kW) langsung dijumlahkan tanpa mengkonversi ke kWh berdasarkan sampling rate.

## Solusi

Implementasi rumus yang benar untuk menghitung kWh berdasarkan sampling rate 3 detik:

### Formula:

- **Hourly Report**: `totalKwh = SUM(real_power) × (3/3600)`

  - Setiap data point mewakili 3 detik
  - 3600 detik = 1 jam
  - Jadi setiap kW dikalikan dengan (3/3600) untuk mendapat kWh

- **Shift Report**: `totalKwh = SUM(real_power dari semua data dalam shift) × (3/3600)`
  - Total dari semua data point dalam rentang waktu shift

## Perubahan yang Dilakukan

### 1. Backend Services (LVMDP 1, 2, 3, 4)

#### Hourly Report Services

**File yang diubah:**

- `pisifmbe/src/lvmdp/LVMDP_1/lvmdp_1.hourlyReport.services.ts`
- `pisifmbe/src/lvmdp/LVMDP_2/lvmdp_2.hourlyReport.services.ts`
- `pisifmbe/src/lvmdp/LVMDP_3/lvmdp_3.hourlyReport.services.ts`
- `pisifmbe/src/lvmdp/LVMDP_4/lvmdp_4.hourlyReport.services.ts`

**Perubahan:**

```typescript
// SEBELUM
SUM(real_power::double precision)::double precision as total_kwh

// SESUDAH
(SUM(real_power::double precision) * (3.0 / 3600.0))::double precision as total_kwh
```

#### Shift Report Services

**File yang diubah:**

- `pisifmbe/src/lvmdp/LVMDP_1/lvmdp_1.services.ts`
- `pisifmbe/src/lvmdp/LVMDP_2/lvmdp_2.services.ts`
- `pisifmbe/src/lvmdp/LVMDP_3/lvmdp_3.services.ts`
- `pisifmbe/src/lvmdp/LVMDP_4/lvmdp_4.services.ts`

**Perubahan dalam fungsi `computeAverages()`:**

```typescript
// SEBELUM
return {
  count: n,
  totalKwh: sumRealPower, // SALAH
  avgKwh: n ? sumRealPower / n : 0,
  // ...
};

// SESUDAH
const totalKwh = sumRealPower * (3.0 / 3600.0);

return {
  count: n,
  totalKwh: totalKwh, // BENAR
  avgKwh: n ? sumRealPower / n : 0,
  // ...
};
```

### 2. Database Schema

**File yang diubah:**

- `pisifmbe/src/db/schema.ts`

**Penambahan kolom** untuk semua LVMDP (1-4):

```typescript
shift1TotalKwh: doublePrecision("shift1_total_kwh").default(0),
shift2TotalKwh: doublePrecision("shift2_total_kwh").default(0),
shift3TotalKwh: doublePrecision("shift3_total_kwh").default(0),
```

### 3. Daily Report Services

**File yang diubah:**

- `pisifmbe/src/lvmdp/LVMDP_1/lvmdp_1.dailyReport.services.ts`
- `pisifmbe/src/lvmdp/LVMDP_2/lvmdp_2.dailyReport.services.ts`
- `pisifmbe/src/lvmdp/LVMDP_3/lvmdp_3.dailyReport.services.ts`
- `pisifmbe/src/lvmdp/LVMDP_4/lvmdp_4.dailyReport.services.ts`

**Perubahan:**

- Menambahkan `totalKwh` ke data yang disimpan
- Menyimpan nilai `totalKwh` yang sudah dihitung dengan benar

### 4. Daily Report Controllers

**File yang diubah:**

- `pisifmbe/src/lvmdp/LVMDP_1/lvmdp_1.dailyReport.controller.ts`
- `pisifmbe/src/lvmdp/LVMDP_2/lvmdp_2.dailyReport.controller.ts`

**Perubahan:**

```typescript
// Menggunakan totalKwh dari database jika tersedia,
// fallback ke avgKwh * count untuk data lama
shift1TotalKwh: r.shift1TotalKwh ?? (r.shift1AvgKwh || 0) * (r.shift1Count || 1),
```

### 5. Database Migration

**File baru:**

- `pisifmbe/drizzle/0011_add_total_kwh_to_daily_reports.sql`
- `pisifmbe/run-migration-total-kwh.ts`

**Isi migration:**

1. Menambahkan kolom `shift1_total_kwh`, `shift2_total_kwh`, `shift3_total_kwh` ke semua tabel daily report
2. Backfill data lama dengan `avgKwh * count` (approximation)

## Cara Menjalankan Migration

```bash
cd pisifmbe
npx tsx run-migration-total-kwh.ts
```

Atau langsung jalankan SQL:

```bash
psql -U your_username -d your_database -f drizzle/0011_add_total_kwh_to_daily_reports.sql
```

## Hasil Akhir

### Data Baru (Setelah Fix)

- ✅ **Hourly Report**: `totalKwh` dihitung dengan `SUM(real_power) × (3/3600)`
- ✅ **Shift Report**: `totalKwh` dihitung dengan formula yang sama
- ✅ Data disimpan ke kolom `shift1_total_kwh`, `shift2_total_kwh`, `shift3_total_kwh`

### Data Lama (Sebelum Fix)

- ⚠️ Menggunakan approximation: `avgKwh × count`
- Data ini akan tetap ada tapi kurang akurat
- Bisa di-regenerate dengan menjalankan ulang daily report scheduler

## Testing

1. **Restart backend** untuk load schema baru
2. **Tunggu scheduler** berjalan untuk generate data baru, atau
3. **Manual trigger** untuk tanggal tertentu:
   ```typescript
   // Dalam server atau script
   import { runDailyReportFor } from "./cron/dailyReportScheduler";
   await runDailyReportFor("2024-12-11"); // Generate untuk hari ini
   ```

## Frontend

Frontend tidak perlu diubah karena sudah menggunakan field `totalKwh` yang benar dari backend.

## Verifikasi

Check apakah nilai totalKwh masuk akal:

- Untuk mesin dengan avg power 100 kW selama 8 jam shift
- Total kWh seharusnya sekitar: 100 kW × 8 jam = 800 kWh
- Bukan: 100 × jumlah_data_points (yang salah)

## Catatan Penting

⚠️ **Data historis** akan menggunakan formula lama (approximation) sampai di-regenerate
⚠️ **Data baru** mulai menggunakan formula yang benar setelah deployment
✅ **Backward compatible** - frontend tetap bisa baca data lama dan baru
