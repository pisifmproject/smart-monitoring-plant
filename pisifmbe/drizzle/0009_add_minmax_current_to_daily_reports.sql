-- Migration: Add min/max current columns to daily report tables
-- Date: 2024-12-11

-- Add columns to daily_report_lvmdp_1
ALTER TABLE "daily_report_lvmdp_1" 
  ADD COLUMN IF NOT EXISTS "shift1_min_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift1_max_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift2_min_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift2_max_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift3_min_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift3_max_current" double precision DEFAULT 0;

-- Add columns to daily_report_lvmdp_2
ALTER TABLE "daily_report_lvmdp_2" 
  ADD COLUMN IF NOT EXISTS "shift1_min_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift1_max_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift2_min_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift2_max_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift3_min_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift3_max_current" double precision DEFAULT 0;

-- Add columns to daily_report_lvmdp_3
ALTER TABLE "daily_report_lvmdp_3" 
  ADD COLUMN IF NOT EXISTS "shift1_min_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift1_max_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift2_min_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift2_max_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift3_min_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift3_max_current" double precision DEFAULT 0;

-- Add columns to daily_report_lvmdp_4
ALTER TABLE "daily_report_lvmdp_4" 
  ADD COLUMN IF NOT EXISTS "shift1_min_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift1_max_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift2_min_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift2_max_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift3_min_current" double precision DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shift3_max_current" double precision DEFAULT 0;
