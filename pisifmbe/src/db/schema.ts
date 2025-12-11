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
  shift1MinCurrent: doublePrecision("shift1_min_current").default(0),
  shift1MaxCurrent: doublePrecision("shift1_max_current").default(0),
  shift1AvgCosPhi: doublePrecision("shift1_avg_cos_phi").default(0),

  shift2Count: integer("shift2_count").default(0),
  shift2AvgKwh: doublePrecision("shift2_avg_kwh").default(0),
  shift2AvgCurrent: doublePrecision("shift2_avg_current").default(0),
  shift2MinCurrent: doublePrecision("shift2_min_current").default(0),
  shift2MaxCurrent: doublePrecision("shift2_max_current").default(0),
  shift2AvgCosPhi: doublePrecision("shift2_avg_cos_phi").default(0),

  shift3Count: integer("shift3_count").default(0),
  shift3AvgKwh: doublePrecision("shift3_avg_kwh").default(0),
  shift3AvgCurrent: doublePrecision("shift3_avg_current").default(0),
  shift3MinCurrent: doublePrecision("shift3_min_current").default(0),
  shift3MaxCurrent: doublePrecision("shift3_max_current").default(0),
  shift3AvgCosPhi: doublePrecision("shift3_avg_cos_phi").default(0),

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
  shift1MinCurrent: doublePrecision("shift1_min_current").default(0),
  shift1MaxCurrent: doublePrecision("shift1_max_current").default(0),
  shift1AvgCosPhi: doublePrecision("shift1_avg_cos_phi").default(0),

  shift2Count: integer("shift2_count").default(0),
  shift2AvgKwh: doublePrecision("shift2_avg_kwh").default(0),
  shift2AvgCurrent: doublePrecision("shift2_avg_current").default(0),
  shift2MinCurrent: doublePrecision("shift2_min_current").default(0),
  shift2MaxCurrent: doublePrecision("shift2_max_current").default(0),
  shift2AvgCosPhi: doublePrecision("shift2_avg_cos_phi").default(0),

  shift3Count: integer("shift3_count").default(0),
  shift3AvgKwh: doublePrecision("shift3_avg_kwh").default(0),
  shift3AvgCurrent: doublePrecision("shift3_avg_current").default(0),
  shift3MinCurrent: doublePrecision("shift3_min_current").default(0),
  shift3MaxCurrent: doublePrecision("shift3_max_current").default(0),
  shift3AvgCosPhi: doublePrecision("shift3_avg_cos_phi").default(0),

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
  shift1MinCurrent: doublePrecision("shift1_min_current").default(0),
  shift1MaxCurrent: doublePrecision("shift1_max_current").default(0),
  shift1AvgCosPhi: doublePrecision("shift1_avg_cos_phi").default(0),

  shift2Count: integer("shift2_count").default(0),
  shift2AvgKwh: doublePrecision("shift2_avg_kwh").default(0),
  shift2AvgCurrent: doublePrecision("shift2_avg_current").default(0),
  shift2MinCurrent: doublePrecision("shift2_min_current").default(0),
  shift2MaxCurrent: doublePrecision("shift2_max_current").default(0),
  shift2AvgCosPhi: doublePrecision("shift2_avg_cos_phi").default(0),

  shift3Count: integer("shift3_count").default(0),
  shift3AvgKwh: doublePrecision("shift3_avg_kwh").default(0),
  shift3AvgCurrent: doublePrecision("shift3_avg_current").default(0),
  shift3MinCurrent: doublePrecision("shift3_min_current").default(0),
  shift3MaxCurrent: doublePrecision("shift3_max_current").default(0),
  shift3AvgCosPhi: doublePrecision("shift3_avg_cos_phi").default(0),

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
  shift1MinCurrent: doublePrecision("shift1_min_current").default(0),
  shift1MaxCurrent: doublePrecision("shift1_max_current").default(0),
  shift1AvgCosPhi: doublePrecision("shift1_avg_cos_phi").default(0),

  shift2Count: integer("shift2_count").default(0),
  shift2AvgKwh: doublePrecision("shift2_avg_kwh").default(0),
  shift2AvgCurrent: doublePrecision("shift2_avg_current").default(0),
  shift2MinCurrent: doublePrecision("shift2_min_current").default(0),
  shift2MaxCurrent: doublePrecision("shift2_max_current").default(0),
  shift2AvgCosPhi: doublePrecision("shift2_avg_cos_phi").default(0),

  shift3Count: integer("shift3_count").default(0),
  shift3AvgKwh: doublePrecision("shift3_avg_kwh").default(0),
  shift3AvgCurrent: doublePrecision("shift3_avg_current").default(0),
  shift3MinCurrent: doublePrecision("shift3_min_current").default(0),
  shift3MaxCurrent: doublePrecision("shift3_max_current").default(0),
  shift3AvgCosPhi: doublePrecision("shift3_avg_cos_phi").default(0),

  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

/* ===========================
   HOURLY REPORT TABLES
   (Menyimpan agregasi per jam - optimasi untuk performa)
   Index pada (report_date, hour) untuk query cepat
=========================== */

/** Hourly Report LVMDP 1 */
export const hourlyReportLVMDP1 = pgTable("hourly_report_lvmdp_1", {
  id: text("id").primaryKey(),

  reportDate: date("report_date").notNull(),
  hour: integer("hour").notNull(), // 0-23

  count: integer("count").default(0),
  totalKwh: doublePrecision("total_kwh").default(0),
  avgKwh: doublePrecision("avg_kwh").default(0),
  avgCurrent: doublePrecision("avg_current").default(0),
  minCurrent: doublePrecision("min_current").default(0),
  maxCurrent: doublePrecision("max_current").default(0),
  avgCosPhi: doublePrecision("avg_cos_phi").default(0),

  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

/** Hourly Report LVMDP 2 */
export const hourlyReportLVMDP2 = pgTable("hourly_report_lvmdp_2", {
  id: text("id").primaryKey(),

  reportDate: date("report_date").notNull(),
  hour: integer("hour").notNull(), // 0-23

  count: integer("count").default(0),
  totalKwh: doublePrecision("total_kwh").default(0),
  avgKwh: doublePrecision("avg_kwh").default(0),
  avgCurrent: doublePrecision("avg_current").default(0),
  minCurrent: doublePrecision("min_current").default(0),
  maxCurrent: doublePrecision("max_current").default(0),
  avgCosPhi: doublePrecision("avg_cos_phi").default(0),

  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

/** Hourly Report LVMDP 3 */
export const hourlyReportLVMDP3 = pgTable("hourly_report_lvmdp_3", {
  id: text("id").primaryKey(),

  reportDate: date("report_date").notNull(),
  hour: integer("hour").notNull(), // 0-23

  count: integer("count").default(0),
  totalKwh: doublePrecision("total_kwh").default(0),
  avgKwh: doublePrecision("avg_kwh").default(0),
  avgCurrent: doublePrecision("avg_current").default(0),
  minCurrent: doublePrecision("min_current").default(0),
  maxCurrent: doublePrecision("max_current").default(0),
  avgCosPhi: doublePrecision("avg_cos_phi").default(0),

  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

/** Hourly Report LVMDP 4 */
export const hourlyReportLVMDP4 = pgTable("hourly_report_lvmdp_4", {
  id: text("id").primaryKey(),

  reportDate: date("report_date").notNull(),
  hour: integer("hour").notNull(), // 0-23

  count: integer("count").default(0),
  totalKwh: doublePrecision("total_kwh").default(0),
  avgKwh: doublePrecision("avg_kwh").default(0),
  avgCurrent: doublePrecision("avg_current").default(0),
  minCurrent: doublePrecision("min_current").default(0),
  maxCurrent: doublePrecision("max_current").default(0),
  avgCosPhi: doublePrecision("avg_cos_phi").default(0),

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
  lineId: text("line_id").notNull().default("LINE_PC14_WEIGHER"),

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
  lineId: text("line_id").notNull().default("LINE_PC14_BAGMAKER"),

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

/* ===========================
   ADDITIONAL PRODUCTION LINES
=========================== */

// Production Line A - PC14
export const productionLineAPC14 = pgTable("production_line_a_pc14", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  lineId: text("line_id").notNull().default("LINE_A_PC14"),
  targetProduction: integer("target_production").default(0),
  actualProduction: integer("actual_production").default(0),
  defectCount: integer("defect_count").default(0),
  status: text("status").default("idle"),
  oeePercentage: doublePrecision("oee_percentage").default(0),
  availability: doublePrecision("availability").default(0),
  performance: doublePrecision("performance").default(0),
  quality: doublePrecision("quality").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Production Line A - TS1000
export const productionLineATS1000 = pgTable("production_line_a_ts1000", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  lineId: text("line_id").notNull().default("LINE_A_TS1000"),
  targetProduction: integer("target_production").default(0),
  actualProduction: integer("actual_production").default(0),
  defectCount: integer("defect_count").default(0),
  status: text("status").default("idle"),
  oeePercentage: doublePrecision("oee_percentage").default(0),
  availability: doublePrecision("availability").default(0),
  performance: doublePrecision("performance").default(0),
  quality: doublePrecision("quality").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Production Line A - FCP
export const productionLineAFCP = pgTable("production_line_a_fcp", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  lineId: text("line_id").notNull().default("LINE_A_FCP"),
  targetProduction: integer("target_production").default(0),
  actualProduction: integer("actual_production").default(0),
  defectCount: integer("defect_count").default(0),
  status: text("status").default("idle"),
  oeePercentage: doublePrecision("oee_percentage").default(0),
  availability: doublePrecision("availability").default(0),
  performance: doublePrecision("performance").default(0),
  quality: doublePrecision("quality").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Production Line A - TWS56
export const productionLineATWS56 = pgTable("production_line_a_tws56", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  lineId: text("line_id").notNull().default("LINE_A_TWS56"),
  targetProduction: integer("target_production").default(0),
  actualProduction: integer("actual_production").default(0),
  defectCount: integer("defect_count").default(0),
  status: text("status").default("idle"),
  oeePercentage: doublePrecision("oee_percentage").default(0),
  availability: doublePrecision("availability").default(0),
  performance: doublePrecision("performance").default(0),
  quality: doublePrecision("quality").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Production Line A - TWS72
export const productionLineATWS72 = pgTable("production_line_a_tws72", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  lineId: text("line_id").notNull().default("LINE_A_TWS72"),
  targetProduction: integer("target_production").default(0),
  actualProduction: integer("actual_production").default(0),
  defectCount: integer("defect_count").default(0),
  status: text("status").default("idle"),
  oeePercentage: doublePrecision("oee_percentage").default(0),
  availability: doublePrecision("availability").default(0),
  performance: doublePrecision("performance").default(0),
  quality: doublePrecision("quality").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Production Line A - COPACK
export const productionLineACOPACK = pgTable("production_line_a_copack", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  lineId: text("line_id").notNull().default("LINE_A_COPACK"),
  targetProduction: integer("target_production").default(0),
  actualProduction: integer("actual_production").default(0),
  defectCount: integer("defect_count").default(0),
  status: text("status").default("idle"),
  oeePercentage: doublePrecision("oee_percentage").default(0),
  availability: doublePrecision("availability").default(0),
  performance: doublePrecision("performance").default(0),
  quality: doublePrecision("quality").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Production Line A - IHP
export const productionLineAIHP = pgTable("production_line_a_ihp", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  lineId: text("line_id").notNull().default("LINE_A_IHP"),
  targetProduction: integer("target_production").default(0),
  actualProduction: integer("actual_production").default(0),
  defectCount: integer("defect_count").default(0),
  status: text("status").default("idle"),
  oeePercentage: doublePrecision("oee_percentage").default(0),
  availability: doublePrecision("availability").default(0),
  performance: doublePrecision("performance").default(0),
  quality: doublePrecision("quality").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ===========================
   ADDITIONAL PACKING LINES (B-I)
=========================== */

// Helper function to create packing line schemas (untuk menghindari repetisi)
const createPackingWeigherTable = (line: string) =>
  pgTable(`packing_line_${line.toLowerCase()}_weigher`, {
    id: text("id").primaryKey(),
    timestamp: timestamp("timestamp").notNull(),
    lineId: text("line_id").notNull().default(`LINE_${line}_WEIGHER`),
    targetPacks: integer("target_packs").default(0),
    actualPacks: integer("actual_packs").default(0),
    rejectCount: integer("reject_count").default(0),
    avgWeight: doublePrecision("avg_weight").default(0),
    minWeight: doublePrecision("min_weight").default(0),
    maxWeight: doublePrecision("max_weight").default(0),
    status: text("status").default("idle"),
    efficiency: doublePrecision("efficiency").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  });

const createPackingBagMakerTable = (line: string) =>
  pgTable(`packing_line_${line.toLowerCase()}_bagmaker`, {
    id: text("id").primaryKey(),
    timestamp: timestamp("timestamp").notNull(),
    lineId: text("line_id").notNull().default(`LINE_${line}_BAGMAKER`),
    targetBags: integer("target_bags").default(0),
    actualBags: integer("actual_bags").default(0),
    defectBags: integer("defect_bags").default(0),
    status: text("status").default("idle"),
    efficiency: doublePrecision("efficiency").default(0),
    speedRpm: doublePrecision("speed_rpm").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  });

// Packing Lines - Weigher (by machine name)
export const packingLinePC39Weigher = createPackingWeigherTable("PC39");
export const packingLineCassavaInhouseWeigher =
  createPackingWeigherTable("CASSAVA_INHOUSE");
export const packingLineCassavaCopackWeigher =
  createPackingWeigherTable("CASSAVA_COPACK");
export const packingLineTortilaWeigher = createPackingWeigherTable("TORTILA");
export const packingLineFCPWeigher = createPackingWeigherTable("FCP");
export const packingLineTWS56Weigher = createPackingWeigherTable("TWS56");
export const packingLineTWS72Weigher = createPackingWeigherTable("TWS72");
export const packingLinePackingPouchWeigher =
  createPackingWeigherTable("PACKING_POUCH");

// Packing Lines - BagMaker (by machine name)
export const packingLinePC39BagMaker = createPackingBagMakerTable("PC39");
export const packingLineCassavaInhouseBagMaker =
  createPackingBagMakerTable("CASSAVA_INHOUSE");
export const packingLineCassavaCopackBagMaker =
  createPackingBagMakerTable("CASSAVA_COPACK");
export const packingLineTortilaBagMaker = createPackingBagMakerTable("TORTILA");
export const packingLineFCPBagMaker = createPackingBagMakerTable("FCP");
export const packingLineTWS56BagMaker = createPackingBagMakerTable("TWS56");
export const packingLineTWS72BagMaker = createPackingBagMakerTable("TWS72");
export const packingLinePackingPouchBagMaker =
  createPackingBagMakerTable("PACKING_POUCH");
