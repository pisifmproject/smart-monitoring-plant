-- Migration: Add total_kwh columns to daily report tables
-- Description: Add shift1_total_kwh, shift2_total_kwh, shift3_total_kwh columns
--              to store properly calculated kWh values using formula: SUM(real_power) × (3/3600)

-- Add total_kwh columns to daily_report_lvmdp_1
ALTER TABLE daily_report_lvmdp_1
ADD COLUMN IF NOT EXISTS shift1_total_kwh double precision DEFAULT 0,
ADD COLUMN IF NOT EXISTS shift2_total_kwh double precision DEFAULT 0,
ADD COLUMN IF NOT EXISTS shift3_total_kwh double precision DEFAULT 0;

-- Add total_kwh columns to daily_report_lvmdp_2
ALTER TABLE daily_report_lvmdp_2
ADD COLUMN IF NOT EXISTS shift1_total_kwh double precision DEFAULT 0,
ADD COLUMN IF NOT EXISTS shift2_total_kwh double precision DEFAULT 0,
ADD COLUMN IF NOT EXISTS shift3_total_kwh double precision DEFAULT 0;

-- Add total_kwh columns to daily_report_lvmdp_3
ALTER TABLE daily_report_lvmdp_3
ADD COLUMN IF NOT EXISTS shift1_total_kwh double precision DEFAULT 0,
ADD COLUMN IF NOT EXISTS shift2_total_kwh double precision DEFAULT 0,
ADD COLUMN IF NOT EXISTS shift3_total_kwh double precision DEFAULT 0;

-- Add total_kwh columns to daily_report_lvmdp_4
ALTER TABLE daily_report_lvmdp_4
ADD COLUMN IF NOT EXISTS shift1_total_kwh double precision DEFAULT 0,
ADD COLUMN IF NOT EXISTS shift2_total_kwh double precision DEFAULT 0,
ADD COLUMN IF NOT EXISTS shift3_total_kwh double precision DEFAULT 0;

-- Optional: Backfill existing data with calculated values
-- NOTE: This uses avgKwh * count as approximation for old data
-- New data will use the correct formula from services

-- Update LVMDP 1
UPDATE daily_report_lvmdp_1
SET 
  shift1_total_kwh = COALESCE(shift1_avg_kwh * shift1_count, 0),
  shift2_total_kwh = COALESCE(shift2_avg_kwh * shift2_count, 0),
  shift3_total_kwh = COALESCE(shift3_avg_kwh * shift3_count, 0)
WHERE shift1_total_kwh = 0 AND shift2_total_kwh = 0 AND shift3_total_kwh = 0;

-- Update LVMDP 2
UPDATE daily_report_lvmdp_2
SET 
  shift1_total_kwh = COALESCE(shift1_avg_kwh * shift1_count, 0),
  shift2_total_kwh = COALESCE(shift2_avg_kwh * shift2_count, 0),
  shift3_total_kwh = COALESCE(shift3_avg_kwh * shift3_count, 0)
WHERE shift1_total_kwh = 0 AND shift2_total_kwh = 0 AND shift3_total_kwh = 0;

-- Update LVMDP 3
UPDATE daily_report_lvmdp_3
SET 
  shift1_total_kwh = COALESCE(shift1_avg_kwh * shift1_count, 0),
  shift2_total_kwh = COALESCE(shift2_avg_kwh * shift2_count, 0),
  shift3_total_kwh = COALESCE(shift3_avg_kwh * shift3_count, 0)
WHERE shift1_total_kwh = 0 AND shift2_total_kwh = 0 AND shift3_total_kwh = 0;

-- Update LVMDP 4
UPDATE daily_report_lvmdp_4
SET 
  shift1_total_kwh = COALESCE(shift1_avg_kwh * shift1_count, 0),
  shift2_total_kwh = COALESCE(shift2_avg_kwh * shift2_count, 0),
  shift3_total_kwh = COALESCE(shift3_avg_kwh * shift3_count, 0)
WHERE shift1_total_kwh = 0 AND shift2_total_kwh = 0 AND shift3_total_kwh = 0;
