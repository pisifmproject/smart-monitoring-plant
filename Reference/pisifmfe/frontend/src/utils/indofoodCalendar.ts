/**
 * Indofood Operational Calendar Utils
 * Berdasarkan kalender operasional Indofood tahun 2025-2026
 * Menggunakan date range sesuai operational calendar blocks
 */

interface IndofoodMonthRange {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

/**
 * Definisi date range untuk setiap bulan operasional Indofood tahun 2025
 * Berdasarkan INDOFOOD_CALENDAR_MAPPING.md
 */
const INDOFOOD_MONTHS_2025: Record<string, IndofoodMonthRange> = {
  "2025-01": { startDate: "2025-01-01", endDate: "2025-02-02" },
  "2025-02": { startDate: "2025-02-03", endDate: "2025-03-02" },
  "2025-03": { startDate: "2025-03-03", endDate: "2025-03-30" },
  "2025-04": { startDate: "2025-03-31", endDate: "2025-05-04" },
  "2025-05": { startDate: "2025-05-05", endDate: "2025-06-01" },
  "2025-06": { startDate: "2025-06-02", endDate: "2025-06-30" },
  "2025-07": { startDate: "2025-07-01", endDate: "2025-08-03" },
  "2025-08": { startDate: "2025-08-04", endDate: "2025-08-31" },
  "2025-09": { startDate: "2025-09-01", endDate: "2025-09-28" },
  "2025-10": { startDate: "2025-09-29", endDate: "2025-11-02" },
  "2025-11": { startDate: "2025-11-03", endDate: "2025-11-30" },
  "2025-12": { startDate: "2025-12-01", endDate: "2025-12-31" },
};

/**
 * Definisi date range untuk setiap bulan operasional Indofood tahun 2026
 * Berdasarkan INDOFOOD_CALENDAR_MAPPING.md
 */
const INDOFOOD_MONTHS_2026: Record<string, IndofoodMonthRange> = {
  "2026-01": { startDate: "2026-01-01", endDate: "2026-02-01" },
  "2026-02": { startDate: "2026-02-02", endDate: "2026-03-01" },
  "2026-03": { startDate: "2026-03-02", endDate: "2026-04-05" },
  "2026-04": { startDate: "2026-04-06", endDate: "2026-05-03" },
  "2026-05": { startDate: "2026-05-04", endDate: "2026-05-31" },
  "2026-06": { startDate: "2026-06-01", endDate: "2026-06-30" },
  "2026-07": { startDate: "2026-07-01", endDate: "2026-08-02" },
  "2026-08": { startDate: "2026-08-03", endDate: "2026-08-30" },
  "2026-09": { startDate: "2026-08-31", endDate: "2026-10-04" },
  "2026-10": { startDate: "2026-10-05", endDate: "2026-11-01" },
  "2026-11": { startDate: "2026-11-02", endDate: "2026-11-29" },
  "2026-12": { startDate: "2026-11-30", endDate: "2026-12-31" },
};

/**
 * Get Indofood month date range
 */
export function getIndofoodMonthRange(
  yearMonth: string
): { start: string; end: string } | null {
  const [year] = yearMonth.split("-").map(Number);

  // Select the appropriate year's data
  const allMonths = year === 2025 ? INDOFOOD_MONTHS_2025 : INDOFOOD_MONTHS_2026;
  const range = allMonths[yearMonth];

  if (!range) {
    console.warn(`No Indofood calendar data for ${yearMonth}`);
    return null;
  }

  return { start: range.startDate, end: range.endDate };
}

/**
 * Get week number within a month for a given date
 */
export function getIndofoodWeek(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const yearMonth = `${year}-${String(month).padStart(2, "0")}`;

  const monthRange = getIndofoodMonthRange(yearMonth);
  if (!monthRange) {
    return {
      month: yearMonth,
      week: 1,
      startDate: new Date(year, month - 1, 1),
      endDate: new Date(year, month, 0),
    };
  }

  const dateStr = date.toISOString().substring(0, 10);
  const inRange = dateStr >= monthRange.start && dateStr <= monthRange.end;

  return {
    month: yearMonth,
    week: inRange ? 1 : 0,
    startDate: new Date(monthRange.start),
    endDate: new Date(monthRange.end),
  };
}

/**
 * Get all dates in a specific Indofood month
 */
export function getIndofoodMonthDates(yearMonth: string): {
  start: string;
  end: string;
} | null {
  return getIndofoodMonthRange(yearMonth);
}

/**
 * Get all dates in a specific Indofood week
 * (For compatibility - now returns full month range)
 */
export function getIndofoodWeekDates(
  yearMonth: string,
  weekNumber: number
): { start: string; end: string } | null {
  return getIndofoodMonthRange(yearMonth);
}

/**
 * Filter data by Indofood month (using actual date ranges from calendar)
 */
export function filterByIndofoodMonth(
  data: any[],
  yearMonth: string,
  dateField: string = "reportDate"
): any[] {
  const monthRange = getIndofoodMonthRange(yearMonth);
  if (!monthRange) return [];

  return data.filter((row) => {
    const rowDate = row[dateField] || row.date;
    if (!rowDate) return false;

    const rowDateStr =
      typeof rowDate === "string"
        ? rowDate.substring(0, 10)
        : new Date(rowDate).toISOString().substring(0, 10);

    return rowDateStr >= monthRange.start && rowDateStr <= monthRange.end;
  });
}

/**
 * Filter data by specific Indofood week
 * (For compatibility - now filters by month since weeks span across calendar months)
 */
export function filterByIndofoodWeek(
  data: any[],
  yearMonth: string,
  weekNumber: number,
  dateField: string = "reportDate"
): any[] {
  return filterByIndofoodMonth(data, yearMonth, dateField);
}

/**
 * Get all Indofood weeks for a given month
 */
export function getIndofoodWeeksInMonth(yearMonth: string): number {
  const monthRange = getIndofoodMonthRange(yearMonth);
  return monthRange ? 1 : 0; // Single operational period per Indofood "month"
}
