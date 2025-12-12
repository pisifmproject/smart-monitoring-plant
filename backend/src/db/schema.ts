import { pgTable, serial, text, boolean, timestamp, integer, numeric, pgEnum, bigserial, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- ENUMS ---
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'SUPERVISOR', 'OPERATOR', 'MAINTENANCE', 'QC', 'MANAGEMENT', 'VIEWER']);
export const utilityTypeEnum = pgEnum('utility_type', ['ELECTRICITY', 'STEAM', 'WATER', 'AIR', 'N2', 'GAS']);
export const periodTypeEnum = pgEnum('period_type', ['HOURLY', 'SHIFT', 'DAILY', 'MONTHLY', 'YEARLY']);
export const alarmSeverityEnum = pgEnum('alarm_severity', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export const downtimeSourceEnum = pgEnum('downtime_source', ['AUTO', 'MANUAL']);
export const maintenanceStatusEnum = pgEnum('maintenance_status', ['OPEN', 'IN_PROGRESS', 'DONE']);
export const visibilityCategoryEnum = pgEnum('visibility_category', ['GLOBAL_DASHBOARD', 'PLANT_DASHBOARD', 'UTILITY_ENERGY', 'MACHINE_DETAIL', 'UTILITY', 'MAIN_PANEL_1', 'MAIN_PANEL_2', 'MAIN_PANEL_3', 'MAIN_PANEL_4', 'OTHER']);
export const visibilityGroupEnum = pgEnum('visibility_group', ['KPI', 'CHART', 'TABLE', 'LIST', 'STATUS', 'FORM', 'CARD', 'UTILITY_CONSUMPTION', 'MACHINES', 'OUTPUT', 'OEE', 'ENERGY', 'ALARM_DATA', 'PROCESS_PARAM', 'MACHINE_HEALTH', 'TAB', 'SEASONING_PROCESS', 'PACKING_LINE_KPI', 'PACKING_WEIGHER', 'PACKING_BAGMAKER', 'OTHER']);

// --- USERS ---
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name'),
  email: text('email'),
  role: userRoleEnum('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- PLANTS ---
export const plants = pgTable('plants', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  location: text('location'),
  isActive: boolean('is_active').default(true).notNull(),
});

export const plantsRelations = relations(plants, ({ many }) => ({
  machines: many(machines),
  lvmdpPanels: many(lvmdpPanels),
}));

// --- MACHINES ---
export const machines = pgTable('machines', {
  id: serial('id').primaryKey(),
  plantId: integer('plant_id').references(() => plants.id).notNull(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  type: text('type'),
  status: text('status'),
  lineGroup: text('line_group'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const machinesRelations = relations(machines, ({ one, many }) => ({
  plant: one(plants, {
    fields: [machines.plantId],
    references: [plants.id],
  }),
  alarms: many(alarms),
  downtimeLogs: many(downtimeLogs),
  maintenanceRecords: many(maintenanceRecords),
}));

// --- LVMDP PANELS ---
export const lvmdpPanels = pgTable('lvmdp_panels', {
  id: serial('id').primaryKey(),
  plantId: integer('plant_id').references(() => plants.id).notNull(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  status: text('status'),
});

export const lvmdpPanelsRelations = relations(lvmdpPanels, ({ one }) => ({
  plant: one(plants, {
    fields: [lvmdpPanels.plantId],
    references: [plants.id],
  }),
}));

// --- UTILITY READINGS ---
export const utilityReadings = pgTable('utility_readings', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  plantId: integer('plant_id').references(() => plants.id).notNull(),
  panelId: integer('panel_id').references(() => lvmdpPanels.id),
  utilityType: utilityTypeEnum('utility_type').notNull(),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end'),
  periodType: periodTypeEnum('period_type').notNull(),
  value: numeric('value', { precision: 14, scale: 3 }).notNull(),
  unit: text('unit').notNull(),
});

// --- UTILITY AREA CONSUMPTION ---
export const utilityAreaConsumption = pgTable('utility_area_consumption', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  plantId: integer('plant_id').references(() => plants.id).notNull(),
  utilityType: utilityTypeEnum('utility_type').notNull(),
  areaName: text('area_name').notNull(),
  periodStart: timestamp('period_start').notNull(),
  periodType: periodTypeEnum('period_type').notNull(),
  value: numeric('value', { precision: 14, scale: 3 }).notNull(),
});

// --- ALARMS ---
export const alarms = pgTable('alarms', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  plantId: integer('plant_id').references(() => plants.id),
  machineId: integer('machine_id').references(() => machines.id),
  panelId: integer('panel_id').references(() => lvmdpPanels.id),
  raisedAt: timestamp('raised_at').notNull(),
  clearedAt: timestamp('cleared_at'),
  source: text('source'),
  code: text('code'),
  message: text('message'),
  severity: alarmSeverityEnum('severity').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  acknowledgedBy: integer('acknowledged_by').references(() => users.id),
  acknowledgedAt: timestamp('acknowledged_at'),
});

export const alarmsRelations = relations(alarms, ({ one }) => ({
  machine: one(machines, {
    fields: [alarms.machineId],
    references: [machines.id],
  }),
}));

// --- DOWNTIME LOGS ---
export const downtimeLogs = pgTable('downtime_logs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  plantId: integer('plant_id').references(() => plants.id).notNull(),
  machineId: integer('machine_id').references(() => machines.id).notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  durationSeconds: integer('duration_seconds'),
  reasonCode: text('reason_code'),
  description: text('description'),
  source: downtimeSourceEnum('source').notNull(),
  createdBy: integer('created_by').references(() => users.id),
});

export const downtimeLogsRelations = relations(downtimeLogs, ({ one }) => ({
  machine: one(machines, {
    fields: [downtimeLogs.machineId],
    references: [machines.id],
  }),
}));

// --- MAINTENANCE RECORDS ---
export const maintenanceRecords = pgTable('maintenance_records', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  alarmId: bigserial('alarm_id', { mode: 'number' }).references(() => alarms.id), // Actually this should probably be bigint/integer reference not serial
  machineId: integer('machine_id').references(() => machines.id),
  checkedBy: integer('checked_by').references(() => users.id),
  startedAt: timestamp('started_at').notNull(),
  completedAt: timestamp('completed_at'),
  status: maintenanceStatusEnum('status').notNull(),
  note: text('note'),
  photoUrl: text('photo_url'),
});

// --- PACKING CONFIGS ---
export const packingConfigs = pgTable('packing_configs', {
  id: serial('id').primaryKey(),
  plantId: integer('plant_id').references(() => plants.id).notNull(),
  machineId: integer('machine_id').references(() => machines.id),
  code: text('code').notNull(),
  name: text('name').notNull(),
  unit: text('unit').notNull(),
  targetPerHour: numeric('target_per_hour', { precision: 12, scale: 3 }),
  isActive: boolean('is_active').default(true).notNull(),
});

// --- VISIBILITY ---
export const visibilityDataItems = pgTable('visibility_data_items', {
  id: serial('id').primaryKey(),
  key: text('key').unique().notNull(),
  label: text('label').notNull(),
  category: visibilityCategoryEnum('category').notNull(),
  groupName: visibilityGroupEnum('group_name').notNull(),
  location: text('location'),
  defaultVisible: boolean('default_visible').default(true).notNull(),
});

export const visibilityRules = pgTable('visibility_rules', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id').references(() => visibilityDataItems.id).notNull(),
  role: userRoleEnum('role').notNull(),
  plantId: integer('plant_id').references(() => plants.id),
  machineId: integer('machine_id').references(() => machines.id),
  visible: boolean('visible').default(true).notNull(),
}, (t) => ({
  uniqueRule: unique().on(t.itemId, t.role, t.plantId, t.machineId),
}));
