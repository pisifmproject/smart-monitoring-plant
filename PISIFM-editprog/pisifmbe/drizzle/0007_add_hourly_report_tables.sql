-- Migration: Add hourly report tables for LVMDP 1-4
-- Purpose: Store hourly aggregated data for fast querying (optimization)
-- Created: 2025-11-27

/* ===========================
   HOURLY REPORT LVMDP 1
=========================== */
CREATE TABLE IF NOT EXISTS "hourly_report_lvmdp_1" (
  "id" text PRIMARY KEY NOT NULL,
  "report_date" date NOT NULL,
  "hour" integer NOT NULL,
  "count" integer DEFAULT 0,
  "total_kwh" double precision DEFAULT 0,
  "avg_kwh" double precision DEFAULT 0,
  "avg_current" double precision DEFAULT 0,
  "avg_cos_phi" double precision DEFAULT 0,
  "created_at" timestamp,
  "updated_at" timestamp
);

-- Unique constraint: one record per date + hour
CREATE UNIQUE INDEX IF NOT EXISTS "hourly_report_lvmdp_1_date_hour_idx" 
  ON "hourly_report_lvmdp_1" ("report_date", "hour");

-- Index for date range queries
CREATE INDEX IF NOT EXISTS "hourly_report_lvmdp_1_date_idx" 
  ON "hourly_report_lvmdp_1" ("report_date");

/* ===========================
   HOURLY REPORT LVMDP 2
=========================== */
CREATE TABLE IF NOT EXISTS "hourly_report_lvmdp_2" (
  "id" text PRIMARY KEY NOT NULL,
  "report_date" date NOT NULL,
  "hour" integer NOT NULL,
  "count" integer DEFAULT 0,
  "total_kwh" double precision DEFAULT 0,
  "avg_kwh" double precision DEFAULT 0,
  "avg_current" double precision DEFAULT 0,
  "avg_cos_phi" double precision DEFAULT 0,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE UNIQUE INDEX IF NOT EXISTS "hourly_report_lvmdp_2_date_hour_idx" 
  ON "hourly_report_lvmdp_2" ("report_date", "hour");

CREATE INDEX IF NOT EXISTS "hourly_report_lvmdp_2_date_idx" 
  ON "hourly_report_lvmdp_2" ("report_date");

/* ===========================
   HOURLY REPORT LVMDP 3
=========================== */
CREATE TABLE IF NOT EXISTS "hourly_report_lvmdp_3" (
  "id" text PRIMARY KEY NOT NULL,
  "report_date" date NOT NULL,
  "hour" integer NOT NULL,
  "count" integer DEFAULT 0,
  "total_kwh" double precision DEFAULT 0,
  "avg_kwh" double precision DEFAULT 0,
  "avg_current" double precision DEFAULT 0,
  "avg_cos_phi" double precision DEFAULT 0,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE UNIQUE INDEX IF NOT EXISTS "hourly_report_lvmdp_3_date_hour_idx" 
  ON "hourly_report_lvmdp_3" ("report_date", "hour");

CREATE INDEX IF NOT EXISTS "hourly_report_lvmdp_3_date_idx" 
  ON "hourly_report_lvmdp_3" ("report_date");

/* ===========================
   HOURLY REPORT LVMDP 4
=========================== */
CREATE TABLE IF NOT EXISTS "hourly_report_lvmdp_4" (
  "id" text PRIMARY KEY NOT NULL,
  "report_date" date NOT NULL,
  "hour" integer NOT NULL,
  "count" integer DEFAULT 0,
  "total_kwh" double precision DEFAULT 0,
  "avg_kwh" double precision DEFAULT 0,
  "avg_current" double precision DEFAULT 0,
  "avg_cos_phi" double precision DEFAULT 0,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE UNIQUE INDEX IF NOT EXISTS "hourly_report_lvmdp_4_date_hour_idx" 
  ON "hourly_report_lvmdp_4" ("report_date", "hour");

CREATE INDEX IF NOT EXISTS "hourly_report_lvmdp_4_date_idx" 
  ON "hourly_report_lvmdp_4" ("report_date");
