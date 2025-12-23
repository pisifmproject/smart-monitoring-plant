-- Add min_current and max_current columns to all hourly report tables

-- LVMDP 1 Hourly Report
ALTER TABLE hourly_report_lvmdp_1 
ADD COLUMN min_current DOUBLE PRECISION DEFAULT 0,
ADD COLUMN max_current DOUBLE PRECISION DEFAULT 0;

-- LVMDP 2 Hourly Report
ALTER TABLE hourly_report_lvmdp_2 
ADD COLUMN min_current DOUBLE PRECISION DEFAULT 0,
ADD COLUMN max_current DOUBLE PRECISION DEFAULT 0;

-- LVMDP 3 Hourly Report
ALTER TABLE hourly_report_lvmdp_3 
ADD COLUMN min_current DOUBLE PRECISION DEFAULT 0,
ADD COLUMN max_current DOUBLE PRECISION DEFAULT 0;

-- LVMDP 4 Hourly Report
ALTER TABLE hourly_report_lvmdp_4 
ADD COLUMN min_current DOUBLE PRECISION DEFAULT 0,
ADD COLUMN max_current DOUBLE PRECISION DEFAULT 0;
