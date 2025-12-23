/**
 * Indofood Operational Calendar utility
 * Berdasarkan INDOFOOD_CALENDAR_MAPPING.md
 */

interface MonthRange {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

/**
 * Date ranges untuk Indofood operational calendar 2025
 */
const INDOFOOD_MONTHS_2025: Record<number, MonthRange> = {
  1: { startDate: "2025-01-01", endDate: "2025-02-02" },
  2: { startDate: "2025-02-03", endDate: "2025-03-02" },
  3: { startDate: "2025-03-03", endDate: "2025-03-30" },
  4: { startDate: "2025-03-31", endDate: "2025-05-04" },
  5: { startDate: "2025-05-05", endDate: "2025-06-01" },
  6: { startDate: "2025-06-02", endDate: "2025-06-30" },
  7: { startDate: "2025-07-01", endDate: "2025-08-03" },
  8: { startDate: "2025-08-04", endDate: "2025-08-31" },
  9: { startDate: "2025-09-01", endDate: "2025-09-28" },
  10: { startDate: "2025-09-29", endDate: "2025-11-02" },
  11: { startDate: "2025-11-03", endDate: "2025-11-30" },
  12: { startDate: "2025-12-01", endDate: "2025-12-31" },
};

/**
 * Date ranges untuk Indofood operational calendar 2026
 */
const INDOFOOD_MONTHS_2026: Record<number, MonthRange> = {
  1: { startDate: "2026-01-01", endDate: "2026-02-01" },
  2: { startDate: "2026-02-02", endDate: "2026-03-01" },
  3: { startDate: "2026-03-02", endDate: "2026-04-05" },
  4: { startDate: "2026-04-06", endDate: "2026-05-03" },
  5: { startDate: "2026-05-04", endDate: "2026-05-31" },
  6: { startDate: "2026-06-01", endDate: "2026-06-30" },
  7: { startDate: "2026-07-01", endDate: "2026-08-02" },
  8: { startDate: "2026-08-03", endDate: "2026-08-30" },
  9: { startDate: "2026-08-31", endDate: "2026-10-04" },
  10: { startDate: "2026-10-05", endDate: "2026-11-01" },
  11: { startDate: "2026-11-02", endDate: "2026-11-29" },
  12: { startDate: "2026-11-30", endDate: "2026-12-31" },
};

/**
 * Get date range untuk Indofood month
 * @param year Year (2025, 2026, etc)
 * @param month Month (1-12)
 * @returns Date range {startDate, endDate} atau null jika tidak ditemukan
 */
export function getIndofoodMonthRange(
  year: number,
  month: number
): MonthRange | null {
  if (year === 2025) {
    return INDOFOOD_MONTHS_2025[month] || null;
  } else if (year === 2026) {
    return INDOFOOD_MONTHS_2026[month] || null;
  }
  return null;
}

/**
 * Get date range untuk calendar month
 * @param year Year
 * @param month Month (1-12)
 * @returns Date range {startDate, endDate}
 */
export function getCalendarMonthRange(year: number, month: number): MonthRange {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
}

/**
 * Get month date range berdasarkan dateType
 * @param year Year
 * @param month Month (1-12)
 * @param dateType "nasional" or "indofood"
 * @returns Date range {startDate, endDate}
 */
export function getMonthDateRange(
  year: number,
  month: number,
  dateType: "nasional" | "indofood" = "nasional"
): MonthRange {
  if (dateType === "indofood") {
    const range = getIndofoodMonthRange(year, month);
    if (range) {
      return range;
    }
    // Fallback ke calendar month jika Indofood data tidak ditemukan
    console.warn(
      `[indofoodCalendar] No Indofood data for ${year}-${month}, using calendar month`
    );
  }

  return getCalendarMonthRange(year, month);
}
