"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyElectricalReports = exports.packingLinePackingPouchBagMaker = exports.packingLineTWS72BagMaker = exports.packingLineTWS56BagMaker = exports.packingLineFCPBagMaker = exports.packingLineTortilaBagMaker = exports.packingLineCassavaCopackBagMaker = exports.packingLineCassavaInhouseBagMaker = exports.packingLinePC39BagMaker = exports.packingLinePackingPouchWeigher = exports.packingLineTWS72Weigher = exports.packingLineTWS56Weigher = exports.packingLineFCPWeigher = exports.packingLineTortilaWeigher = exports.packingLineCassavaCopackWeigher = exports.packingLineCassavaInhouseWeigher = exports.packingLinePC39Weigher = exports.productionLineAIHP = exports.productionLineACOPACK = exports.productionLineATWS72 = exports.productionLineATWS56 = exports.productionLineAFCP = exports.productionLineATS1000 = exports.productionLineAPC14 = exports.packingLineABagMaker = exports.packingLineAWeigher = exports.productionLineAPC39 = exports.hourlyReportLVMDP4 = exports.hourlyReportLVMDP3 = exports.hourlyReportLVMDP2 = exports.hourlyReportLVMDP1 = exports.dailyReportLVMDP4 = exports.dailyReportLVMDP3 = exports.dailyReportLVMDP2 = exports.dailyReportLVMDP1 = exports.user = void 0;
// src/db/schema.ts
const pg_core_1 = require("drizzle-orm/pg-core");
/* ===========================
   USER TABLE
=========================== */
exports.user = (0, pg_core_1.pgTable)("User", {
    id: (0, pg_core_1.text)("id").primaryKey().notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    name: (0, pg_core_1.text)("name"),
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
exports.dailyReportLVMDP1 = (0, pg_core_1.pgTable)("daily_report_lvmdp_1", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    reportDate: (0, pg_core_1.date)("report_date").notNull().unique(),
    shift1Count: (0, pg_core_1.integer)("shift1_count").default(0),
    shift1TotalKwh: (0, pg_core_1.doublePrecision)("shift1_total_kwh").default(0),
    shift1AvgKwh: (0, pg_core_1.doublePrecision)("shift1_avg_kwh").default(0),
    shift1AvgCurrent: (0, pg_core_1.doublePrecision)("shift1_avg_current").default(0),
    shift1MinCurrent: (0, pg_core_1.doublePrecision)("shift1_min_current").default(0),
    shift1MaxCurrent: (0, pg_core_1.doublePrecision)("shift1_max_current").default(0),
    shift1AvgCosPhi: (0, pg_core_1.doublePrecision)("shift1_avg_cos_phi").default(0),
    shift2Count: (0, pg_core_1.integer)("shift2_count").default(0),
    shift2TotalKwh: (0, pg_core_1.doublePrecision)("shift2_total_kwh").default(0),
    shift2AvgKwh: (0, pg_core_1.doublePrecision)("shift2_avg_kwh").default(0),
    shift2AvgCurrent: (0, pg_core_1.doublePrecision)("shift2_avg_current").default(0),
    shift2MinCurrent: (0, pg_core_1.doublePrecision)("shift2_min_current").default(0),
    shift2MaxCurrent: (0, pg_core_1.doublePrecision)("shift2_max_current").default(0),
    shift2AvgCosPhi: (0, pg_core_1.doublePrecision)("shift2_avg_cos_phi").default(0),
    shift3Count: (0, pg_core_1.integer)("shift3_count").default(0),
    shift3TotalKwh: (0, pg_core_1.doublePrecision)("shift3_total_kwh").default(0),
    shift3AvgKwh: (0, pg_core_1.doublePrecision)("shift3_avg_kwh").default(0),
    shift3AvgCurrent: (0, pg_core_1.doublePrecision)("shift3_avg_current").default(0),
    shift3MinCurrent: (0, pg_core_1.doublePrecision)("shift3_min_current").default(0),
    shift3MaxCurrent: (0, pg_core_1.doublePrecision)("shift3_max_current").default(0),
    shift3AvgCosPhi: (0, pg_core_1.doublePrecision)("shift3_avg_cos_phi").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at"),
});
/** Daily Report LVMDP 2 */
exports.dailyReportLVMDP2 = (0, pg_core_1.pgTable)("daily_report_lvmdp_2", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    reportDate: (0, pg_core_1.date)("report_date").notNull().unique(),
    shift1Count: (0, pg_core_1.integer)("shift1_count").default(0),
    shift1TotalKwh: (0, pg_core_1.doublePrecision)("shift1_total_kwh").default(0),
    shift1AvgKwh: (0, pg_core_1.doublePrecision)("shift1_avg_kwh").default(0),
    shift1AvgCurrent: (0, pg_core_1.doublePrecision)("shift1_avg_current").default(0),
    shift1MinCurrent: (0, pg_core_1.doublePrecision)("shift1_min_current").default(0),
    shift1MaxCurrent: (0, pg_core_1.doublePrecision)("shift1_max_current").default(0),
    shift1AvgCosPhi: (0, pg_core_1.doublePrecision)("shift1_avg_cos_phi").default(0),
    shift2Count: (0, pg_core_1.integer)("shift2_count").default(0),
    shift2TotalKwh: (0, pg_core_1.doublePrecision)("shift2_total_kwh").default(0),
    shift2AvgKwh: (0, pg_core_1.doublePrecision)("shift2_avg_kwh").default(0),
    shift2AvgCurrent: (0, pg_core_1.doublePrecision)("shift2_avg_current").default(0),
    shift2MinCurrent: (0, pg_core_1.doublePrecision)("shift2_min_current").default(0),
    shift2MaxCurrent: (0, pg_core_1.doublePrecision)("shift2_max_current").default(0),
    shift2AvgCosPhi: (0, pg_core_1.doublePrecision)("shift2_avg_cos_phi").default(0),
    shift3Count: (0, pg_core_1.integer)("shift3_count").default(0),
    shift3TotalKwh: (0, pg_core_1.doublePrecision)("shift3_total_kwh").default(0),
    shift3AvgKwh: (0, pg_core_1.doublePrecision)("shift3_avg_kwh").default(0),
    shift3AvgCurrent: (0, pg_core_1.doublePrecision)("shift3_avg_current").default(0),
    shift3MinCurrent: (0, pg_core_1.doublePrecision)("shift3_min_current").default(0),
    shift3MaxCurrent: (0, pg_core_1.doublePrecision)("shift3_max_current").default(0),
    shift3AvgCosPhi: (0, pg_core_1.doublePrecision)("shift3_avg_cos_phi").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at"),
});
/** Daily Report LVMDP 3 */
exports.dailyReportLVMDP3 = (0, pg_core_1.pgTable)("daily_report_lvmdp_3", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    reportDate: (0, pg_core_1.date)("report_date").notNull().unique(),
    shift1Count: (0, pg_core_1.integer)("shift1_count").default(0),
    shift1TotalKwh: (0, pg_core_1.doublePrecision)("shift1_total_kwh").default(0),
    shift1AvgKwh: (0, pg_core_1.doublePrecision)("shift1_avg_kwh").default(0),
    shift1AvgCurrent: (0, pg_core_1.doublePrecision)("shift1_avg_current").default(0),
    shift1MinCurrent: (0, pg_core_1.doublePrecision)("shift1_min_current").default(0),
    shift1MaxCurrent: (0, pg_core_1.doublePrecision)("shift1_max_current").default(0),
    shift1AvgCosPhi: (0, pg_core_1.doublePrecision)("shift1_avg_cos_phi").default(0),
    shift2Count: (0, pg_core_1.integer)("shift2_count").default(0),
    shift2TotalKwh: (0, pg_core_1.doublePrecision)("shift2_total_kwh").default(0),
    shift2AvgKwh: (0, pg_core_1.doublePrecision)("shift2_avg_kwh").default(0),
    shift2AvgCurrent: (0, pg_core_1.doublePrecision)("shift2_avg_current").default(0),
    shift2MinCurrent: (0, pg_core_1.doublePrecision)("shift2_min_current").default(0),
    shift2MaxCurrent: (0, pg_core_1.doublePrecision)("shift2_max_current").default(0),
    shift2AvgCosPhi: (0, pg_core_1.doublePrecision)("shift2_avg_cos_phi").default(0),
    shift3Count: (0, pg_core_1.integer)("shift3_count").default(0),
    shift3TotalKwh: (0, pg_core_1.doublePrecision)("shift3_total_kwh").default(0),
    shift3AvgKwh: (0, pg_core_1.doublePrecision)("shift3_avg_kwh").default(0),
    shift3AvgCurrent: (0, pg_core_1.doublePrecision)("shift3_avg_current").default(0),
    shift3MinCurrent: (0, pg_core_1.doublePrecision)("shift3_min_current").default(0),
    shift3MaxCurrent: (0, pg_core_1.doublePrecision)("shift3_max_current").default(0),
    shift3AvgCosPhi: (0, pg_core_1.doublePrecision)("shift3_avg_cos_phi").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at"),
});
/** Daily Report LVMDP 4 */
exports.dailyReportLVMDP4 = (0, pg_core_1.pgTable)("daily_report_lvmdp_4", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    reportDate: (0, pg_core_1.date)("report_date").notNull().unique(),
    shift1Count: (0, pg_core_1.integer)("shift1_count").default(0),
    shift1TotalKwh: (0, pg_core_1.doublePrecision)("shift1_total_kwh").default(0),
    shift1AvgKwh: (0, pg_core_1.doublePrecision)("shift1_avg_kwh").default(0),
    shift1AvgCurrent: (0, pg_core_1.doublePrecision)("shift1_avg_current").default(0),
    shift1MinCurrent: (0, pg_core_1.doublePrecision)("shift1_min_current").default(0),
    shift1MaxCurrent: (0, pg_core_1.doublePrecision)("shift1_max_current").default(0),
    shift1AvgCosPhi: (0, pg_core_1.doublePrecision)("shift1_avg_cos_phi").default(0),
    shift2Count: (0, pg_core_1.integer)("shift2_count").default(0),
    shift2TotalKwh: (0, pg_core_1.doublePrecision)("shift2_total_kwh").default(0),
    shift2AvgKwh: (0, pg_core_1.doublePrecision)("shift2_avg_kwh").default(0),
    shift2AvgCurrent: (0, pg_core_1.doublePrecision)("shift2_avg_current").default(0),
    shift2MinCurrent: (0, pg_core_1.doublePrecision)("shift2_min_current").default(0),
    shift2MaxCurrent: (0, pg_core_1.doublePrecision)("shift2_max_current").default(0),
    shift2AvgCosPhi: (0, pg_core_1.doublePrecision)("shift2_avg_cos_phi").default(0),
    shift3Count: (0, pg_core_1.integer)("shift3_count").default(0),
    shift3TotalKwh: (0, pg_core_1.doublePrecision)("shift3_total_kwh").default(0),
    shift3AvgKwh: (0, pg_core_1.doublePrecision)("shift3_avg_kwh").default(0),
    shift3AvgCurrent: (0, pg_core_1.doublePrecision)("shift3_avg_current").default(0),
    shift3MinCurrent: (0, pg_core_1.doublePrecision)("shift3_min_current").default(0),
    shift3MaxCurrent: (0, pg_core_1.doublePrecision)("shift3_max_current").default(0),
    shift3AvgCosPhi: (0, pg_core_1.doublePrecision)("shift3_avg_cos_phi").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at"),
});
/* ===========================
   HOURLY REPORT TABLES
   (Menyimpan agregasi per jam - optimasi untuk performa)
   Index pada (report_date, hour) untuk query cepat
=========================== */
/** Hourly Report LVMDP 1 */
exports.hourlyReportLVMDP1 = (0, pg_core_1.pgTable)("hourly_report_lvmdp_1", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    reportDate: (0, pg_core_1.date)("report_date").notNull(),
    hour: (0, pg_core_1.integer)("hour").notNull(), // 0-23
    count: (0, pg_core_1.integer)("count").default(0),
    totalKwh: (0, pg_core_1.doublePrecision)("total_kwh").default(0),
    avgKwh: (0, pg_core_1.doublePrecision)("avg_kwh").default(0),
    avgCurrent: (0, pg_core_1.doublePrecision)("avg_current").default(0),
    minCurrent: (0, pg_core_1.doublePrecision)("min_current").default(0),
    maxCurrent: (0, pg_core_1.doublePrecision)("max_current").default(0),
    avgCosPhi: (0, pg_core_1.doublePrecision)("avg_cos_phi").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at"),
});
/** Hourly Report LVMDP 2 */
exports.hourlyReportLVMDP2 = (0, pg_core_1.pgTable)("hourly_report_lvmdp_2", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    reportDate: (0, pg_core_1.date)("report_date").notNull(),
    hour: (0, pg_core_1.integer)("hour").notNull(), // 0-23
    count: (0, pg_core_1.integer)("count").default(0),
    totalKwh: (0, pg_core_1.doublePrecision)("total_kwh").default(0),
    avgKwh: (0, pg_core_1.doublePrecision)("avg_kwh").default(0),
    avgCurrent: (0, pg_core_1.doublePrecision)("avg_current").default(0),
    minCurrent: (0, pg_core_1.doublePrecision)("min_current").default(0),
    maxCurrent: (0, pg_core_1.doublePrecision)("max_current").default(0),
    avgCosPhi: (0, pg_core_1.doublePrecision)("avg_cos_phi").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at"),
});
/** Hourly Report LVMDP 3 */
exports.hourlyReportLVMDP3 = (0, pg_core_1.pgTable)("hourly_report_lvmdp_3", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    reportDate: (0, pg_core_1.date)("report_date").notNull(),
    hour: (0, pg_core_1.integer)("hour").notNull(), // 0-23
    count: (0, pg_core_1.integer)("count").default(0),
    totalKwh: (0, pg_core_1.doublePrecision)("total_kwh").default(0),
    avgKwh: (0, pg_core_1.doublePrecision)("avg_kwh").default(0),
    avgCurrent: (0, pg_core_1.doublePrecision)("avg_current").default(0),
    minCurrent: (0, pg_core_1.doublePrecision)("min_current").default(0),
    maxCurrent: (0, pg_core_1.doublePrecision)("max_current").default(0),
    avgCosPhi: (0, pg_core_1.doublePrecision)("avg_cos_phi").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at"),
});
/** Hourly Report LVMDP 4 */
exports.hourlyReportLVMDP4 = (0, pg_core_1.pgTable)("hourly_report_lvmdp_4", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    reportDate: (0, pg_core_1.date)("report_date").notNull(),
    hour: (0, pg_core_1.integer)("hour").notNull(), // 0-23
    count: (0, pg_core_1.integer)("count").default(0),
    totalKwh: (0, pg_core_1.doublePrecision)("total_kwh").default(0),
    avgKwh: (0, pg_core_1.doublePrecision)("avg_kwh").default(0),
    avgCurrent: (0, pg_core_1.doublePrecision)("avg_current").default(0),
    minCurrent: (0, pg_core_1.doublePrecision)("min_current").default(0),
    maxCurrent: (0, pg_core_1.doublePrecision)("max_current").default(0),
    avgCosPhi: (0, pg_core_1.doublePrecision)("avg_cos_phi").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at"),
});
/* ===========================
   PRODUCTION LINE TABLES
   (Menyimpan data production line)
=========================== */
/** Production Line A - PC39 */
exports.productionLineAPC39 = (0, pg_core_1.pgTable)("production_line_a_pc39", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull(),
    lineId: (0, pg_core_1.text)("line_id").notNull().default("LINE_A_PC39"),
    // Production Metrics
    targetProduction: (0, pg_core_1.integer)("target_production").default(0),
    actualProduction: (0, pg_core_1.integer)("actual_production").default(0),
    defectCount: (0, pg_core_1.integer)("defect_count").default(0),
    // Machine Status
    status: (0, pg_core_1.text)("status").default("idle"), // running, idle, maintenance, down
    oeePercentage: (0, pg_core_1.doublePrecision)("oee_percentage").default(0),
    availability: (0, pg_core_1.doublePrecision)("availability").default(0),
    performance: (0, pg_core_1.doublePrecision)("performance").default(0),
    quality: (0, pg_core_1.doublePrecision)("quality").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
/* ===========================
   PACKING LINE TABLES
   (Menyimpan data packing line)
=========================== */
/** Packing Line A - Weigher */
exports.packingLineAWeigher = (0, pg_core_1.pgTable)("packing_line_a_weigher", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull(),
    lineId: (0, pg_core_1.text)("line_id").notNull().default("LINE_PC14_WEIGHER"),
    // Packing Metrics
    targetPacks: (0, pg_core_1.integer)("target_packs").default(0),
    actualPacks: (0, pg_core_1.integer)("actual_packs").default(0),
    rejectCount: (0, pg_core_1.integer)("reject_count").default(0),
    // Weight Metrics
    avgWeight: (0, pg_core_1.doublePrecision)("avg_weight").default(0),
    minWeight: (0, pg_core_1.doublePrecision)("min_weight").default(0),
    maxWeight: (0, pg_core_1.doublePrecision)("max_weight").default(0),
    // Machine Status
    status: (0, pg_core_1.text)("status").default("idle"), // running, idle, maintenance, down
    efficiency: (0, pg_core_1.doublePrecision)("efficiency").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
/** Packing Line A - BagMaker */
exports.packingLineABagMaker = (0, pg_core_1.pgTable)("packing_line_a_bagmaker", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull(),
    lineId: (0, pg_core_1.text)("line_id").notNull().default("LINE_PC14_BAGMAKER"),
    // Packing Metrics
    targetBags: (0, pg_core_1.integer)("target_bags").default(0),
    actualBags: (0, pg_core_1.integer)("actual_bags").default(0),
    defectBags: (0, pg_core_1.integer)("defect_bags").default(0),
    // Machine Status
    status: (0, pg_core_1.text)("status").default("idle"), // running, idle, maintenance, down
    efficiency: (0, pg_core_1.doublePrecision)("efficiency").default(0),
    speedRpm: (0, pg_core_1.doublePrecision)("speed_rpm").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
/* ===========================
   ADDITIONAL PRODUCTION LINES
=========================== */
// Production Line A - PC14
exports.productionLineAPC14 = (0, pg_core_1.pgTable)("production_line_a_pc14", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull(),
    lineId: (0, pg_core_1.text)("line_id").notNull().default("LINE_A_PC14"),
    targetProduction: (0, pg_core_1.integer)("target_production").default(0),
    actualProduction: (0, pg_core_1.integer)("actual_production").default(0),
    defectCount: (0, pg_core_1.integer)("defect_count").default(0),
    status: (0, pg_core_1.text)("status").default("idle"),
    oeePercentage: (0, pg_core_1.doublePrecision)("oee_percentage").default(0),
    availability: (0, pg_core_1.doublePrecision)("availability").default(0),
    performance: (0, pg_core_1.doublePrecision)("performance").default(0),
    quality: (0, pg_core_1.doublePrecision)("quality").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Production Line A - TS1000
exports.productionLineATS1000 = (0, pg_core_1.pgTable)("production_line_a_ts1000", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull(),
    lineId: (0, pg_core_1.text)("line_id").notNull().default("LINE_A_TS1000"),
    targetProduction: (0, pg_core_1.integer)("target_production").default(0),
    actualProduction: (0, pg_core_1.integer)("actual_production").default(0),
    defectCount: (0, pg_core_1.integer)("defect_count").default(0),
    status: (0, pg_core_1.text)("status").default("idle"),
    oeePercentage: (0, pg_core_1.doublePrecision)("oee_percentage").default(0),
    availability: (0, pg_core_1.doublePrecision)("availability").default(0),
    performance: (0, pg_core_1.doublePrecision)("performance").default(0),
    quality: (0, pg_core_1.doublePrecision)("quality").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Production Line A - FCP
exports.productionLineAFCP = (0, pg_core_1.pgTable)("production_line_a_fcp", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull(),
    lineId: (0, pg_core_1.text)("line_id").notNull().default("LINE_A_FCP"),
    targetProduction: (0, pg_core_1.integer)("target_production").default(0),
    actualProduction: (0, pg_core_1.integer)("actual_production").default(0),
    defectCount: (0, pg_core_1.integer)("defect_count").default(0),
    status: (0, pg_core_1.text)("status").default("idle"),
    oeePercentage: (0, pg_core_1.doublePrecision)("oee_percentage").default(0),
    availability: (0, pg_core_1.doublePrecision)("availability").default(0),
    performance: (0, pg_core_1.doublePrecision)("performance").default(0),
    quality: (0, pg_core_1.doublePrecision)("quality").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Production Line A - TWS56
exports.productionLineATWS56 = (0, pg_core_1.pgTable)("production_line_a_tws56", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull(),
    lineId: (0, pg_core_1.text)("line_id").notNull().default("LINE_A_TWS56"),
    targetProduction: (0, pg_core_1.integer)("target_production").default(0),
    actualProduction: (0, pg_core_1.integer)("actual_production").default(0),
    defectCount: (0, pg_core_1.integer)("defect_count").default(0),
    status: (0, pg_core_1.text)("status").default("idle"),
    oeePercentage: (0, pg_core_1.doublePrecision)("oee_percentage").default(0),
    availability: (0, pg_core_1.doublePrecision)("availability").default(0),
    performance: (0, pg_core_1.doublePrecision)("performance").default(0),
    quality: (0, pg_core_1.doublePrecision)("quality").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Production Line A - TWS72
exports.productionLineATWS72 = (0, pg_core_1.pgTable)("production_line_a_tws72", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull(),
    lineId: (0, pg_core_1.text)("line_id").notNull().default("LINE_A_TWS72"),
    targetProduction: (0, pg_core_1.integer)("target_production").default(0),
    actualProduction: (0, pg_core_1.integer)("actual_production").default(0),
    defectCount: (0, pg_core_1.integer)("defect_count").default(0),
    status: (0, pg_core_1.text)("status").default("idle"),
    oeePercentage: (0, pg_core_1.doublePrecision)("oee_percentage").default(0),
    availability: (0, pg_core_1.doublePrecision)("availability").default(0),
    performance: (0, pg_core_1.doublePrecision)("performance").default(0),
    quality: (0, pg_core_1.doublePrecision)("quality").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Production Line A - COPACK
exports.productionLineACOPACK = (0, pg_core_1.pgTable)("production_line_a_copack", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull(),
    lineId: (0, pg_core_1.text)("line_id").notNull().default("LINE_A_COPACK"),
    targetProduction: (0, pg_core_1.integer)("target_production").default(0),
    actualProduction: (0, pg_core_1.integer)("actual_production").default(0),
    defectCount: (0, pg_core_1.integer)("defect_count").default(0),
    status: (0, pg_core_1.text)("status").default("idle"),
    oeePercentage: (0, pg_core_1.doublePrecision)("oee_percentage").default(0),
    availability: (0, pg_core_1.doublePrecision)("availability").default(0),
    performance: (0, pg_core_1.doublePrecision)("performance").default(0),
    quality: (0, pg_core_1.doublePrecision)("quality").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Production Line A - IHP
exports.productionLineAIHP = (0, pg_core_1.pgTable)("production_line_a_ihp", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull(),
    lineId: (0, pg_core_1.text)("line_id").notNull().default("LINE_A_IHP"),
    targetProduction: (0, pg_core_1.integer)("target_production").default(0),
    actualProduction: (0, pg_core_1.integer)("actual_production").default(0),
    defectCount: (0, pg_core_1.integer)("defect_count").default(0),
    status: (0, pg_core_1.text)("status").default("idle"),
    oeePercentage: (0, pg_core_1.doublePrecision)("oee_percentage").default(0),
    availability: (0, pg_core_1.doublePrecision)("availability").default(0),
    performance: (0, pg_core_1.doublePrecision)("performance").default(0),
    quality: (0, pg_core_1.doublePrecision)("quality").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
/* ===========================
   ADDITIONAL PACKING LINES (B-I)
=========================== */
// Helper function to create packing line schemas (untuk menghindari repetisi)
const createPackingWeigherTable = (line) => (0, pg_core_1.pgTable)(`packing_line_${line.toLowerCase()}_weigher`, {
    id: (0, pg_core_1.text)("id").primaryKey(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull(),
    lineId: (0, pg_core_1.text)("line_id").notNull().default(`LINE_${line}_WEIGHER`),
    targetPacks: (0, pg_core_1.integer)("target_packs").default(0),
    actualPacks: (0, pg_core_1.integer)("actual_packs").default(0),
    rejectCount: (0, pg_core_1.integer)("reject_count").default(0),
    avgWeight: (0, pg_core_1.doublePrecision)("avg_weight").default(0),
    minWeight: (0, pg_core_1.doublePrecision)("min_weight").default(0),
    maxWeight: (0, pg_core_1.doublePrecision)("max_weight").default(0),
    status: (0, pg_core_1.text)("status").default("idle"),
    efficiency: (0, pg_core_1.doublePrecision)("efficiency").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
const createPackingBagMakerTable = (line) => (0, pg_core_1.pgTable)(`packing_line_${line.toLowerCase()}_bagmaker`, {
    id: (0, pg_core_1.text)("id").primaryKey(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull(),
    lineId: (0, pg_core_1.text)("line_id").notNull().default(`LINE_${line}_BAGMAKER`),
    targetBags: (0, pg_core_1.integer)("target_bags").default(0),
    actualBags: (0, pg_core_1.integer)("actual_bags").default(0),
    defectBags: (0, pg_core_1.integer)("defect_bags").default(0),
    status: (0, pg_core_1.text)("status").default("idle"),
    efficiency: (0, pg_core_1.doublePrecision)("efficiency").default(0),
    speedRpm: (0, pg_core_1.doublePrecision)("speed_rpm").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Packing Lines - Weigher (by machine name)
exports.packingLinePC39Weigher = createPackingWeigherTable("PC39");
exports.packingLineCassavaInhouseWeigher = createPackingWeigherTable("CASSAVA_INHOUSE");
exports.packingLineCassavaCopackWeigher = createPackingWeigherTable("CASSAVA_COPACK");
exports.packingLineTortilaWeigher = createPackingWeigherTable("TORTILA");
exports.packingLineFCPWeigher = createPackingWeigherTable("FCP");
exports.packingLineTWS56Weigher = createPackingWeigherTable("TWS56");
exports.packingLineTWS72Weigher = createPackingWeigherTable("TWS72");
exports.packingLinePackingPouchWeigher = createPackingWeigherTable("PACKING_POUCH");
// Packing Lines - BagMaker (by machine name)
exports.packingLinePC39BagMaker = createPackingBagMakerTable("PC39");
exports.packingLineCassavaInhouseBagMaker = createPackingBagMakerTable("CASSAVA_INHOUSE");
exports.packingLineCassavaCopackBagMaker = createPackingBagMakerTable("CASSAVA_COPACK");
exports.packingLineTortilaBagMaker = createPackingBagMakerTable("TORTILA");
exports.packingLineFCPBagMaker = createPackingBagMakerTable("FCP");
exports.packingLineTWS56BagMaker = createPackingBagMakerTable("TWS56");
exports.packingLineTWS72BagMaker = createPackingBagMakerTable("TWS72");
exports.packingLinePackingPouchBagMaker = createPackingBagMakerTable("PACKING_POUCH");
/* ===========================
   ELECTRICAL REPORTING TABLES
   (Professional energy monitoring - ISO 50001 compliant)
=========================== */
/**
 * Daily Electrical Reports - Aggregated per panel per day
 * Used for historical reporting (daily, weekly, monthly)
 */
exports.dailyElectricalReports = (0, pg_core_1.pgTable)("daily_electrical_reports", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    panelId: (0, pg_core_1.text)("panel_id").notNull(), // LVMDP_1, LVMDP_2, etc.
    reportDate: (0, pg_core_1.date)("report_date").notNull(),
    // Energy metrics
    energyKwh: (0, pg_core_1.doublePrecision)("energy_kwh").notNull(),
    // Power metrics
    avgLoadKw: (0, pg_core_1.doublePrecision)("avg_load_kw").notNull(),
    peakDemandKw: (0, pg_core_1.doublePrecision)("peak_demand_kw").notNull(),
    peakDemandTime: (0, pg_core_1.timestamp)("peak_demand_time"),
    // Voltage quality
    avgVoltage: (0, pg_core_1.doublePrecision)("avg_voltage").notNull(),
    minVoltage: (0, pg_core_1.doublePrecision)("min_voltage").notNull(),
    maxVoltage: (0, pg_core_1.doublePrecision)("max_voltage").notNull(),
    // Current
    avgCurrent: (0, pg_core_1.doublePrecision)("avg_current").notNull(),
    maxCurrent: (0, pg_core_1.doublePrecision)("max_current").notNull(),
    // Power factor
    avgPowerFactor: (0, pg_core_1.doublePrecision)("avg_power_factor").notNull(),
    // Data quality
    sampleCount: (0, pg_core_1.integer)("sample_count").notNull(),
    dataCompletenessPercent: (0, pg_core_1.doublePrecision)("data_completeness_percent").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
