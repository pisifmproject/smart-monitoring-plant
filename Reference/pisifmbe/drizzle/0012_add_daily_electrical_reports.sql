-- Migration: Create daily_electrical_reports table
-- Professional electrical reporting system (ISO 50001 compliant)

CREATE TABLE IF NOT EXISTS "daily_electrical_reports" (
  "id" text PRIMARY KEY NOT NULL,
  "panel_id" text NOT NULL,
  "report_date" date NOT NULL,
  
  -- Energy metrics
  "energy_kwh" double precision NOT NULL,
  
  -- Power metrics
  "avg_load_kw" double precision NOT NULL,
  "peak_demand_kw" double precision NOT NULL,
  "peak_demand_time" timestamp,
  
  -- Voltage quality
  "avg_voltage" double precision NOT NULL,
  "min_voltage" double precision NOT NULL,
  "max_voltage" double precision NOT NULL,
  
  -- Current
  "avg_current" double precision NOT NULL,
  "max_current" double precision NOT NULL,
  
  -- Power factor
  "avg_power_factor" double precision NOT NULL,
  
  -- Data quality
  "sample_count" integer NOT NULL,
  "data_completeness_percent" double precision NOT NULL,
  
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS "idx_daily_electrical_reports_date" ON "daily_electrical_reports" ("report_date");
CREATE INDEX IF NOT EXISTS "idx_daily_electrical_reports_panel" ON "daily_electrical_reports" ("panel_id");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_daily_electrical_reports_panel_date" ON "daily_electrical_reports" ("panel_id", "report_date");

-- Comment
COMMENT ON TABLE "daily_electrical_reports" IS 'Aggregated daily electrical metrics for professional reporting';
