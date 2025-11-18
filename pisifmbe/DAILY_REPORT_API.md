# Daily Report & Monthly Report API Documentation

## Deskripsi

Fitur ini memungkinkan Anda untuk:

- **Generate Daily Report**: Menghitung & menyimpan rata-rata per shift (shift 1, 2, 3) untuk satu hari
- **Fetch Daily Report**: Mengambil report untuk tanggal tertentu
- **Fetch Monthly Report**: Mengambil semua daily report dalam satu bulan
- **Fetch All Daily Reports**: Mengambil semua report

## Database Schema

Setiap LVMDP memiliki tabel `daily_report_lvmdp_X` dengan struktur:

```sql
- id (TEXT): Unique identifier
- report_date (DATE): Tanggal laporan
- shift1_count (INTEGER): Jumlah data dalam shift 1
- shift1_avg_kwh (DOUBLE PRECISION): Rata-rata kWh shift 1
- shift1_avg_current (DOUBLE PRECISION): Rata-rata current shift 1
- shift2_count, shift2_avg_kwh, shift2_avg_current
- shift3_count, shift3_avg_kwh, shift3_avg_current
- created_at (TIMESTAMP): Waktu dibuat
- updated_at (TIMESTAMP): Waktu diupdate terakhir
```

## API Endpoints

### 1. Generate Daily Report

**POST** `/api/lvmdp{N}/daily-report/generate`

Generate & save daily report untuk hari tertentu (atau hari ini jika tidak ada parameter).

**Query Parameters:**

- `date` (optional): Format `YYYY-MM-DD`. Default: hari ini

**Example:**

```bash
# Generate report untuk hari ini
curl -X POST http://localhost:2000/api/lvmdp1/daily-report/generate

# Generate report untuk tanggal spesifik
curl -X POST "http://localhost:2000/api/lvmdp1/daily-report/generate?date=2025-11-15"
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Daily report untuk 2025-11-15 berhasil dibuat",
  "data": [
    {
      "id": "uuid-here",
      "reportDate": "2025-11-15",
      "shift1Count": 42,
      "shift1AvgKwh": 402.0123,
      "shift1AvgCurrent": 232.0035,
      "shift2Count": 45,
      "shift2AvgKwh": 410.0456,
      "shift2AvgCurrent": 235.1234,
      "shift3Count": 38,
      "shift3AvgKwh": 395.0789,
      "shift3AvgCurrent": 228.5678,
      "createdAt": "2025-11-15T10:05:00.000Z",
      "updatedAt": "2025-11-15T10:05:00.000Z"
    }
  ]
}
```

---

### 2. Get Daily Report

**GET** `/api/lvmdp{N}/daily-report/:date`

Fetch daily report untuk tanggal tertentu.

**Path Parameters:**

- `date` (required): Format `YYYY-MM-DD`

**Example:**

```bash
curl http://localhost:2000/api/lvmdp1/daily-report/2025-11-15
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "reportDate": "2025-11-15",
    "shift1Count": 42,
    "shift1AvgKwh": 402.0123,
    "shift1AvgCurrent": 232.0035,
    "shift2Count": 45,
    "shift2AvgKwh": 410.0456,
    "shift2AvgCurrent": 235.1234,
    "shift3Count": 38,
    "shift3AvgKwh": 395.0789,
    "shift3AvgCurrent": 228.5678,
    "createdAt": "2025-11-15T10:05:00.000Z",
    "updatedAt": "2025-11-15T10:05:00.000Z"
  }
}
```

**Response jika tidak ada data (200 OK):**

```json
{
  "success": true,
  "data": null
}
```

---

### 3. Get Monthly Report

**GET** `/api/lvmdp{N}/daily-report/monthly/:year/:month`

Fetch semua daily report dalam satu bulan (untuk membuat tabel di frontend).

**Path Parameters:**

- `year` (required): Tahun (e.g., 2025)
- `month` (required): Bulan 1-12

**Example:**

```bash
# Get November 2025 reports
curl http://localhost:2000/api/lvmdp1/daily-report/monthly/2025/11
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "reportDate": "2025-11-01",
      "shift1Count": 40,
      "shift1AvgKwh": 400.1234,
      "shift1AvgCurrent": 230.0,
      "shift2Count": 42,
      "shift2AvgKwh": 405.5678,
      "shift2AvgCurrent": 233.0,
      "shift3Count": 35,
      "shift3AvgKwh": 390.0,
      "shift3AvgCurrent": 225.0,
      "createdAt": "2025-11-01T10:05:00.000Z",
      "updatedAt": "2025-11-01T10:05:00.000Z"
    },
    {
      "id": "uuid-2",
      "reportDate": "2025-11-02",
      "shift1Count": 42,
      "shift1AvgKwh": 402.0123,
      "shift1AvgCurrent": 232.0035,
      "shift2Count": 45,
      "shift2AvgKwh": 410.0456,
      "shift2AvgCurrent": 235.1234,
      "shift3Count": 38,
      "shift3AvgKwh": 395.0789,
      "shift3AvgCurrent": 228.5678,
      "createdAt": "2025-11-02T10:05:00.000Z",
      "updatedAt": "2025-11-02T10:05:00.000Z"
    }
    // ... more days
  ]
}
```

---

### 4. Get All Daily Reports

**GET** `/api/lvmdp{N}/daily-report/all`

Fetch semua daily report (untuk historical data).

**Example:**

```bash
curl http://localhost:2000/api/lvmdp1/daily-report/all
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "reportDate": "2025-10-01",
      "shift1Count": 40,
      "shift1AvgKwh": 400.1234,
      "shift1AvgCurrent": 230.0
      // ...
    },
    {
      "id": "uuid-2",
      "reportDate": "2025-10-02",
      "shift1Count": 42,
      "shift1AvgKwh": 402.0123
      // ...
    }
    // ... all reports
  ]
}
```

---

## Cara Menggunakan di Frontend

### Contoh untuk Monthly Report (Tabel):

```typescript
// Fetch monthly report
const fetchMonthlyReport = async (year: number, month: number) => {
  const res = await fetch(
    `http://localhost:2000/api/lvmdp1/daily-report/monthly/${year}/${month}`
  );
  const result = await res.json();
  return result.data; // Array of daily reports
};

// Usage
const reports = await fetchMonthlyReport(2025, 11);

// Render sebagai tabel
const tableData = reports.map((report) => ({
  date: report.reportDate,
  shift1Kwh: report.shift1AvgKwh.toFixed(2),
  shift1Current: report.shift1AvgCurrent.toFixed(2),
  shift2Kwh: report.shift2AvgKwh.toFixed(2),
  shift2Current: report.shift2AvgCurrent.toFixed(2),
  shift3Kwh: report.shift3AvgKwh.toFixed(2),
  shift3Current: report.shift3AvgCurrent.toFixed(2),
}));
```

---

## Catatan Penting

1. **Auto-Reset per Hari**: Setiap kali Anda generate report untuk tanggal berbeda, data akan otomatis ter-reset dan dihitung ulang sesuai shift.

2. **Shift 3 Lintas Hari**: Shift 3 (22:01 - 07:00) otomatis menghitung data yang melewati tengah malam.

3. **Update Strategy**: Jika Anda generate report untuk tanggal yang sama dua kali, data akan di-update (replace) dengan nilai terbaru.

4. **Data Flow**:
   - Raw data → dari view `v_lvmdp_1` (database view)
   - Difilter per shift → dihitung rata-ratanya
   - Disimpan → ke tabel `daily_report_lvmdp_1`

---

## Contoh Frontend Integration

### Tabel Daily Report untuk November:

```javascript
import React, { useEffect, useState } from "react";

export const DailyReportTable = ({ year = 2025, month = 11 }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `http://localhost:2000/api/lvmdp1/daily-report/monthly/${year}/${month}`
      );
      const { data } = await res.json();
      setReports(data);
      setLoading(false);
    };

    fetchData();
  }, [year, month]);

  if (loading) return <div>Loading...</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Tanggal</th>
          <th colspan="2">Shift 1 (07:01-14:30)</th>
          <th colspan="2">Shift 2 (14:31-22:00)</th>
          <th colspan="2">Shift 3 (22:01-07:00)</th>
        </tr>
        <tr>
          <th></th>
          <th>Avg kWh</th>
          <th>Avg Current</th>
          <th>Avg kWh</th>
          <th>Avg Current</th>
          <th>Avg kWh</th>
          <th>Avg Current</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.id}>
            <td>{new Date(report.reportDate).toLocaleDateString("id-ID")}</td>
            <td>{report.shift1AvgKwh.toFixed(2)}</td>
            <td>{report.shift1AvgCurrent.toFixed(2)}</td>
            <td>{report.shift2AvgKwh.toFixed(2)}</td>
            <td>{report.shift2AvgCurrent.toFixed(2)}</td>
            <td>{report.shift3AvgKwh.toFixed(2)}</td>
            <td>{report.shift3AvgCurrent.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```
