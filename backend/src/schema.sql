-- Users
CREATE TYPE user_role AS ENUM ('ADMIN', 'SUPERVISOR', 'OPERATOR', 'MAINTENANCE', 'QC', 'MANAGEMENT', 'VIEWER');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    role user_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Plants
CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Machines
CREATE TABLE machines (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES plants(id),
    code VARCHAR(30) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    status VARCHAR(20),
    line_group VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- LVMDP Panels
CREATE TABLE lvmdp_panels (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES plants(id),
    code VARCHAR(30) NOT NULL,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20)
);

-- Utility Readings
CREATE TYPE utility_type AS ENUM ('ELECTRICITY', 'STEAM', 'WATER', 'AIR', 'N2', 'GAS');
CREATE TYPE period_type AS ENUM ('HOURLY', 'SHIFT', 'DAILY', 'MONTHLY', 'YEARLY');

CREATE TABLE utility_readings (
    id BIGSERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES plants(id),
    panel_id INTEGER REFERENCES lvmdp_panels(id),
    utility_type utility_type NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ,
    period_type period_type NOT NULL,
    value NUMERIC(14,3) NOT NULL,
    unit VARCHAR(20) NOT NULL
);

-- Utility Area Consumption
CREATE TABLE utility_area_consumption (
    id BIGSERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES plants(id),
    utility_type utility_type NOT NULL,
    area_name VARCHAR(100) NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_type period_type NOT NULL,
    value NUMERIC(14,3) NOT NULL
);

-- Alarms
CREATE TYPE alarm_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

CREATE TABLE alarms (
    id BIGSERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES plants(id),
    machine_id INTEGER REFERENCES machines(id),
    panel_id INTEGER REFERENCES lvmdp_panels(id),
    raised_at TIMESTAMPTZ NOT NULL,
    cleared_at TIMESTAMPTZ,
    source VARCHAR(50),
    code VARCHAR(50),
    message VARCHAR(255),
    severity alarm_severity NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    acknowledged_by INTEGER REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ
);

-- Downtime Logs
CREATE TYPE downtime_source AS ENUM ('AUTO', 'MANUAL');

CREATE TABLE downtime_logs (
    id BIGSERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES plants(id),
    machine_id INTEGER NOT NULL REFERENCES machines(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_seconds INTEGER,
    reason_code VARCHAR(50),
    description TEXT,
    source downtime_source NOT NULL,
    created_by INTEGER REFERENCES users(id)
);

-- Maintenance Records
CREATE TYPE maintenance_status AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE');

CREATE TABLE maintenance_records (
    id BIGSERIAL PRIMARY KEY,
    alarm_id BIGINT REFERENCES alarms(id),
    machine_id INTEGER REFERENCES machines(id),
    checked_by INTEGER REFERENCES users(id),
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    status maintenance_status NOT NULL,
    note TEXT,
    photo_url VARCHAR(255)
);

-- Packing Configs
CREATE TABLE packing_configs (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES plants(id),
    machine_id INTEGER REFERENCES machines(id),
    code VARCHAR(30) NOT NULL,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    target_per_hour NUMERIC(12,3),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Visibility Data Items
CREATE TYPE visibility_category AS ENUM ('GLOBAL_DASHBOARD', 'PLANT_DASHBOARD', 'UTILITY_ENERGY');
CREATE TYPE visibility_group AS ENUM ('KPI', 'CHART', 'TABLE', 'LIST', 'STATUS', 'FORM', 'CARD', 'UTILITY_CONSUMPTION', 'MACHINES');

CREATE TABLE visibility_data_items (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    category visibility_category NOT NULL,
    group_name visibility_group NOT NULL,
    location VARCHAR(100),
    default_visible BOOLEAN NOT NULL DEFAULT TRUE
);

-- Visibility Rules
CREATE TABLE visibility_rules (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES visibility_data_items(id),
    role user_role NOT NULL,
    plant_id INTEGER REFERENCES plants(id),
    machine_id INTEGER REFERENCES machines(id),
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (item_id, role, plant_id, machine_id)
);
