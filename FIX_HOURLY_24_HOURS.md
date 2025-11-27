# Fix: Hourly Report Menampilkan 24 Jam Penuh

## Problem

Hourly report hanya menampilkan 10-16 jam saja, padahal seharusnya menampilkan 24 jam penuh sesuai dengan shift yang berjalan (07:00 hari ini sampai 06:59 hari berikutnya).

### Root Cause

Logic hourly filtering hanya mengambil data yang **exact match dengan tanggal yang dipilih**:

```typescript
if (rowDateStr !== today) continue;
```

Ini menyebabkan data dari jam 00:00-06:59 hari berikutnya (yang merupakan bagian dari shift 3) tidak ter-capture.

## Solution

### Backend Changes

Updated hourly calculation di semua LVMDP (1, 2, 3, 4) untuk:

1. **Fetch data dengan date range** (hari ini + hari berikutnya)

   ```typescript
   const nextDay = new Date(today);
   nextDay.setDate(nextDay.getDate() + 1);
   const allRows = await findLVMDPs(today, nextDay.toISOString().slice(0, 10));
   ```

2. **Filter berdasarkan 24-jam window** (07:00 WIB hari ini - 06:59 WIB hari berikutnya)

   ```typescript
   const startTime = new Date(`${today}T00:00:00.000Z`); // 07:00 WIB
   const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);

   if (t < startTime || t >= endTime) continue;
   ```

3. **Update repository** untuk support date range parameter
   ```typescript
   export async function findLVMDPs(dateFrom?: string, dateTo?: string) {
     // Filter di database level untuk performa
   }
   ```

### Files Modified

- ✅ `pisifmbe/src/lvmdp/LVMDP_1/lvmdp_1.repository.ts`
- ✅ `pisifmbe/src/lvmdp/LVMDP_1/lvmdp_1.services.ts`
- ✅ `pisifmbe/src/lvmdp/LVMDP_2/lvmdp_2.repository.ts`
- ✅ `pisifmbe/src/lvmdp/LVMDP_2/lvmdp_2.services.ts`
- ✅ `pisifmbe/src/lvmdp/LVMDP_3/lvmdp_3.repository.ts`
- ✅ `pisifmbe/src/lvmdp/LVMDP_3/lvmdp_3.services.ts`
- ✅ `pisifmbe/src/lvmdp/LVMDP_4/lvmdp_4.repository.ts`
- ✅ `pisifmbe/src/lvmdp/LVMDP_4/lvmdp_4.services.ts`
- ✅ `pisifmfe/frontend/src/views/dailyReport/lvmdp/lvmdpDailyReport.vue` (cache v6→v7)

## How It Works Now

### Example: Pilih tanggal 27 November 2025

**Before (Salah):**

- Ambil data: `WHERE waktu::date = '2025-11-27'`
- Result: Hanya jam 07:00-23:59 tanggal 27 (17 jam)
- Missing: Jam 00:00-06:59 tanggal 28 yang seharusnya masuk shift 3

**After (Benar):**

- Ambil data: `WHERE waktu >= '2025-11-27 00:00:00' AND waktu < '2025-11-28 00:00:00'` (UTC)
- Filter: `t >= '2025-11-27T00:00:00.000Z' AND t < '2025-11-28T00:00:00.000Z'`
- Dalam WIB: 07:00 tanggal 27 sampai 06:59 tanggal 28
- Result: **24 jam penuh** ✅

### Hourly Range Breakdown

| Hour WIB | Date   | Shift   | Status              |
| -------- | ------ | ------- | ------------------- |
| 07:00    | Nov 27 | Shift 1 | ✅ Included         |
| 08:00    | Nov 27 | Shift 1 | ✅ Included         |
| ...      | ...    | ...     | ...                 |
| 14:00    | Nov 27 | Shift 1 | ✅ Included         |
| 15:00    | Nov 27 | Shift 2 | ✅ Included         |
| ...      | ...    | ...     | ...                 |
| 22:00    | Nov 27 | Shift 2 | ✅ Included         |
| 23:00    | Nov 27 | Shift 3 | ✅ Included         |
| 00:00    | Nov 28 | Shift 3 | ✅ **NOW INCLUDED** |
| 01:00    | Nov 28 | Shift 3 | ✅ **NOW INCLUDED** |
| ...      | ...    | ...     | ...                 |
| 06:00    | Nov 28 | Shift 3 | ✅ **NOW INCLUDED** |

## Alignment dengan Shift Times

Hourly report sekarang konsisten dengan shift calculation:

- **Shift 1**: 07:01-14:30 (jam 07:00-14:00)
- **Shift 2**: 14:31-22:00 (jam 14:00-22:00)
- **Shift 3**: 22:01-07:00 (jam 22:00-06:00 next day) ← **Fixed!**

## Testing

1. Pilih tanggal di daily report LVMDP (any panel 1-4)
2. Klik tab "Hourly Reports"
3. Verify:
   - ✅ Ada 24 rows (jam 07:00 - 06:00)
   - ✅ Jam 00:00-06:00 menampilkan tanggal **hari berikutnya**
   - ✅ Data terisi (tidak 0.00 semua)

## User Action Required

**Refresh browser** (Ctrl+R) untuk:

1. Load JavaScript baru dengan cache v7
2. Clear old cached data (v6)
3. Fetch fresh 24-hour data from backend

## Technical Notes

- Database waktu disimpan dalam **UTC** (PostgreSQL timestamptz)
- Aplikasi timezone: **WIB (UTC+7)**
- Conversion: `const wibTime = new Date(utcTime.getTime() + 7 * 60 * 60 * 1000)`
- SQL filter optimized di database level untuk performa
