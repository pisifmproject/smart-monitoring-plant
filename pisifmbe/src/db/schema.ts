// src/db/schema.ts
import {
  pgTable,
  text,
  timestamp,
  doublePrecision,
  date,
  integer,
} from "drizzle-orm/pg-core";

/* ===========================
   USER TABLE
=========================== */
export const user = pgTable("User", {
  id: text("id").primaryKey().notNull(),
  email: text("email").notNull(),
  name: text("name"),
});

/* ===========================
      VIEW LVMDP_1..4
   (READ ONLY - Exist in DB, managed externally)
   Do not create/modify - only for reading data
=========================== */

// Views sudah ada di database, tidak perlu didefinisikan ulang di schema
// Kita hanya baca data dari views ini menggunakan raw SQL
// Lihat: lvmdp_1.repository.ts, lvmdp_2.repository.ts, etc

/* ===========================
   DAILY REPORT TABLES
   (Menyimpan avg per shift per hari)
=========================== */

/** Daily Report LVMDP 1 */
export const dailyReportLVMDP1 = pgTable(
  "daily_report_lvmdp_1",
  {
    id: text("id").primaryKey(),

    reportDate: date("report_date")
      .notNull()
      .unique(), 

    shift1Count: integer("shift1_count").default(0),
    shift1AvgKwh: doublePrecision("shift1_avg_kwh").default(0),
    shift1AvgCurrent: doublePrecision("shift1_avg_current").default(0),

    shift2Count: integer("shift2_count").default(0),
    shift2AvgKwh: doublePrecision("shift2_avg_kwh").default(0),
    shift2AvgCurrent: doublePrecision("shift2_avg_current").default(0),

    shift3Count: integer("shift3_count").default(0),
    shift3AvgKwh: doublePrecision("shift3_avg_kwh").default(0),
    shift3AvgCurrent: doublePrecision("shift3_avg_current").default(0),

    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  }
);


/** Daily Report LVMDP 2 */
export const dailyReportLVMDP2 = pgTable(
  "daily_report_lvmdp_2",
  {
    id: text("id").primaryKey(),

    reportDate: date("report_date")
      .notNull()
      .unique(), 

    shift1Count: integer("shift1_count").default(0),
    shift1AvgKwh: doublePrecision("shift1_avg_kwh").default(0),
    shift1AvgCurrent: doublePrecision("shift1_avg_current").default(0),

    shift2Count: integer("shift2_count").default(0),
    shift2AvgKwh: doublePrecision("shift2_avg_kwh").default(0),
    shift2AvgCurrent: doublePrecision("shift2_avg_current").default(0),

    shift3Count: integer("shift3_count").default(0),
    shift3AvgKwh: doublePrecision("shift3_avg_kwh").default(0),
    shift3AvgCurrent: doublePrecision("shift3_avg_current").default(0),

    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  }
);

/** Daily Report LVMDP 3 */
export const dailyReportLVMDP3 = pgTable(
  "daily_report_lvmdp_3",
  {
    id: text("id").primaryKey(),

    reportDate: date("report_date")
      .notNull()
      .unique(), 

    shift1Count: integer("shift1_count").default(0),
    shift1AvgKwh: doublePrecision("shift1_avg_kwh").default(0),
    shift1AvgCurrent: doublePrecision("shift1_avg_current").default(0),

    shift2Count: integer("shift2_count").default(0),
    shift2AvgKwh: doublePrecision("shift2_avg_kwh").default(0),
    shift2AvgCurrent: doublePrecision("shift2_avg_current").default(0),

    shift3Count: integer("shift3_count").default(0),
    shift3AvgKwh: doublePrecision("shift3_avg_kwh").default(0),
    shift3AvgCurrent: doublePrecision("shift3_avg_current").default(0),

    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  }
);

/** Daily Report LVMDP 4 */
export const dailyReportLVMDP4 = pgTable(
  "daily_report_lvmdp_4",
  {
    id: text("id").primaryKey(),

    reportDate: date("report_date")
      .notNull()
      .unique(), 

    shift1Count: integer("shift1_count").default(0),
    shift1AvgKwh: doublePrecision("shift1_avg_kwh").default(0),
    shift1AvgCurrent: doublePrecision("shift1_avg_current").default(0),

    shift2Count: integer("shift2_count").default(0),
    shift2AvgKwh: doublePrecision("shift2_avg_kwh").default(0),
    shift2AvgCurrent: doublePrecision("shift2_avg_current").default(0),

    shift3Count: integer("shift3_count").default(0),
    shift3AvgKwh: doublePrecision("shift3_avg_kwh").default(0),
    shift3AvgCurrent: doublePrecision("shift3_avg_current").default(0),

    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  }
);
