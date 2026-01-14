-- Migration: Add performance indexes for faster queries
-- Purpose: Optimize LVMDP latest data queries and report generation
-- Created: 2026-01-14

/* ===========================
   LVMDP VIEW INDEXES
   Add DESC index on waktu for faster "latest" queries
=========================== */

-- Index for fast "ORDER BY waktu DESC LIMIT 1" queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lvmdp_1_waktu_desc 
  ON public.lvmdp_1(waktu DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lvmdp_2_waktu_desc 
  ON public.lvmdp_2(waktu DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lvmdp_3_waktu_desc 
  ON public.lvmdp_3(waktu DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lvmdp_4_waktu_desc 
  ON public.lvmdp_4(waktu DESC);

-- Index for lvmdp_hmi table (used as fallback)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lvmdp_hmi_datetime_desc 
  ON public.lvmdp_hmi(datetimefield DESC);

/* ===========================
   DAILY REPORT INDEXES
   Composite indexes for date range queries
=========================== */

-- Composite index for daily report queries by date range
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_daily_report_lvmdp_1_date 
  ON public.daily_report_lvmdp_1(report_date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_daily_report_lvmdp_2_date 
  ON public.daily_report_lvmdp_2(report_date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_daily_report_lvmdp_3_date 
  ON public.daily_report_lvmdp_3(report_date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_daily_report_lvmdp_4_date 
  ON public.daily_report_lvmdp_4(report_date DESC);

/* ===========================
   HOURLY REPORT INDEXES
   Composite indexes for hourly data queries
=========================== */

-- Composite index for hourly report queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hourly_report_lvmdp_1_date_hour 
  ON public.hourly_report_lvmdp_1(report_date, hour);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hourly_report_lvmdp_2_date_hour 
  ON public.hourly_report_lvmdp_2(report_date, hour);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hourly_report_lvmdp_3_date_hour 
  ON public.hourly_report_lvmdp_3(report_date, hour);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hourly_report_lvmdp_4_date_hour 
  ON public.hourly_report_lvmdp_4(report_date, hour);

/* ===========================
   ANALYZE TABLES
   Update statistics for query planner
=========================== */

ANALYZE public.lvmdp_1;
ANALYZE public.lvmdp_2;
ANALYZE public.lvmdp_3;
ANALYZE public.lvmdp_4;
ANALYZE public.lvmdp_hmi;
