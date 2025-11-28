-- Add cos_phi columns to all daily_report tables

ALTER TABLE daily_report_lvmdp_1
  ADD COLUMN shift1_avg_cos_phi DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN shift2_avg_cos_phi DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN shift3_avg_cos_phi DOUBLE PRECISION DEFAULT 0;

ALTER TABLE daily_report_lvmdp_2
  ADD COLUMN shift1_avg_cos_phi DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN shift2_avg_cos_phi DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN shift3_avg_cos_phi DOUBLE PRECISION DEFAULT 0;

ALTER TABLE daily_report_lvmdp_3
  ADD COLUMN shift1_avg_cos_phi DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN shift2_avg_cos_phi DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN shift3_avg_cos_phi DOUBLE PRECISION DEFAULT 0;

ALTER TABLE daily_report_lvmdp_4
  ADD COLUMN shift1_avg_cos_phi DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN shift2_avg_cos_phi DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN shift3_avg_cos_phi DOUBLE PRECISION DEFAULT 0;
