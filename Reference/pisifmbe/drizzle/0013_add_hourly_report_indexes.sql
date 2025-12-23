-- Add composite indexes for faster hourly report queries
-- These indexes optimize the common query pattern: WHERE report_date = ? ORDER BY hour

-- LVMDP 1
CREATE INDEX IF NOT EXISTS idx_hourly_report_lvmdp_1_date_hour 
ON hourly_report_lvmdp_1(report_date, hour);

-- LVMDP 2
CREATE INDEX IF NOT EXISTS idx_hourly_report_lvmdp_2_date_hour 
ON hourly_report_lvmdp_2(report_date, hour);

-- LVMDP 3
CREATE INDEX IF NOT EXISTS idx_hourly_report_lvmdp_3_date_hour 
ON hourly_report_lvmdp_3(report_date, hour);

-- LVMDP 4
CREATE INDEX IF NOT EXISTS idx_hourly_report_lvmdp_4_date_hour 
ON hourly_report_lvmdp_4(report_date, hour);
