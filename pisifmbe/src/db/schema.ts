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
export const dailyReportLVMDP1 = pgTable("daily_report_lvmdp_1", {
  id: text("id").primaryKey(),

  reportDate: date("report_date").notNull().unique(),

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
});

/** Daily Report LVMDP 2 */
export const dailyReportLVMDP2 = pgTable("daily_report_lvmdp_2", {
  id: text("id").primaryKey(),

  reportDate: date("report_date").notNull().unique(),

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
});

/** Daily Report LVMDP 3 */
export const dailyReportLVMDP3 = pgTable("daily_report_lvmdp_3", {
  id: text("id").primaryKey(),

  reportDate: date("report_date").notNull().unique(),

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
});

/** Daily Report LVMDP 4 */
export const dailyReportLVMDP4 = pgTable("daily_report_lvmdp_4", {
  id: text("id").primaryKey(),

  reportDate: date("report_date").notNull().unique(),

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
});

/* ===========================
   PRODUCTION LINE TABLES
   (Menyimpan data production line)
=========================== */

/** Production Line A - PC39 */
export const productionLineAPC39 = pgTable("production_line_a_pc39", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  lineId: text("line_id").notNull().default("LINE_A_PC39"),

  // Production Metrics
  targetProduction: integer("target_production").default(0),
  actualProduction: integer("actual_production").default(0),
  defectCount: integer("defect_count").default(0),

  // Machine Status
  status: text("status").default("idle"), // running, idle, maintenance, down
  oeePercentage: doublePrecision("oee_percentage").default(0),
  availability: doublePrecision("availability").default(0),
  performance: doublePrecision("performance").default(0),
  quality: doublePrecision("quality").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ===========================
   PACKING LINE TABLES
   (Menyimpan data packing line)
=========================== */

/** Packing Line A - Weigher */
export const packingLineAWeigher = pgTable("packing_line_a_weigher", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  lineId: text("line_id").notNull().default("LINE_A_WEIGHER"),

  // Packing Metrics
  targetPacks: integer("target_packs").default(0),
  actualPacks: integer("actual_packs").default(0),
  rejectCount: integer("reject_count").default(0),

  // Weight Metrics
  avgWeight: doublePrecision("avg_weight").default(0),
  minWeight: doublePrecision("min_weight").default(0),
  maxWeight: doublePrecision("max_weight").default(0),

  // Machine Status
  status: text("status").default("idle"), // running, idle, maintenance, down
  efficiency: doublePrecision("efficiency").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/** Packing Line A - BagMaker */
export const packingLineABagMaker = pgTable("packing_line_a_bagmaker", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  lineId: text("line_id").notNull().default("LINE_A_BAGMAKER"),

  // Packing Metrics
  targetBags: integer("target_bags").default(0),
  actualBags: integer("actual_bags").default(0),
  defectBags: integer("defect_bags").default(0),

  // Machine Status
  status: text("status").default("idle"), // running, idle, maintenance, down
  efficiency: doublePrecision("efficiency").default(0),
  speedRpm: doublePrecision("speed_rpm").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
