CREATE TABLE "packing_line_a_bagmaker" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_A_BAGMAKER' NOT NULL,
	"target_bags" integer DEFAULT 0,
	"actual_bags" integer DEFAULT 0,
	"defect_bags" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"speed_rpm" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_a_weigher" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_A_WEIGHER' NOT NULL,
	"target_packs" integer DEFAULT 0,
	"actual_packs" integer DEFAULT 0,
	"reject_count" integer DEFAULT 0,
	"avg_weight" double precision DEFAULT 0,
	"min_weight" double precision DEFAULT 0,
	"max_weight" double precision DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_b_bagmaker" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_B_BAGMAKER' NOT NULL,
	"target_bags" integer DEFAULT 0,
	"actual_bags" integer DEFAULT 0,
	"defect_bags" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"speed_rpm" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_b_weigher" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_B_WEIGHER' NOT NULL,
	"target_packs" integer DEFAULT 0,
	"actual_packs" integer DEFAULT 0,
	"reject_count" integer DEFAULT 0,
	"avg_weight" double precision DEFAULT 0,
	"min_weight" double precision DEFAULT 0,
	"max_weight" double precision DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_c_bagmaker" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_C_BAGMAKER' NOT NULL,
	"target_bags" integer DEFAULT 0,
	"actual_bags" integer DEFAULT 0,
	"defect_bags" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"speed_rpm" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_c_weigher" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_C_WEIGHER' NOT NULL,
	"target_packs" integer DEFAULT 0,
	"actual_packs" integer DEFAULT 0,
	"reject_count" integer DEFAULT 0,
	"avg_weight" double precision DEFAULT 0,
	"min_weight" double precision DEFAULT 0,
	"max_weight" double precision DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_d_bagmaker" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_D_BAGMAKER' NOT NULL,
	"target_bags" integer DEFAULT 0,
	"actual_bags" integer DEFAULT 0,
	"defect_bags" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"speed_rpm" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_d_weigher" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_D_WEIGHER' NOT NULL,
	"target_packs" integer DEFAULT 0,
	"actual_packs" integer DEFAULT 0,
	"reject_count" integer DEFAULT 0,
	"avg_weight" double precision DEFAULT 0,
	"min_weight" double precision DEFAULT 0,
	"max_weight" double precision DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_e_bagmaker" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_E_BAGMAKER' NOT NULL,
	"target_bags" integer DEFAULT 0,
	"actual_bags" integer DEFAULT 0,
	"defect_bags" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"speed_rpm" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_e_weigher" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_E_WEIGHER' NOT NULL,
	"target_packs" integer DEFAULT 0,
	"actual_packs" integer DEFAULT 0,
	"reject_count" integer DEFAULT 0,
	"avg_weight" double precision DEFAULT 0,
	"min_weight" double precision DEFAULT 0,
	"max_weight" double precision DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_f_bagmaker" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_F_BAGMAKER' NOT NULL,
	"target_bags" integer DEFAULT 0,
	"actual_bags" integer DEFAULT 0,
	"defect_bags" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"speed_rpm" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_f_weigher" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_F_WEIGHER' NOT NULL,
	"target_packs" integer DEFAULT 0,
	"actual_packs" integer DEFAULT 0,
	"reject_count" integer DEFAULT 0,
	"avg_weight" double precision DEFAULT 0,
	"min_weight" double precision DEFAULT 0,
	"max_weight" double precision DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_g_bagmaker" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_G_BAGMAKER' NOT NULL,
	"target_bags" integer DEFAULT 0,
	"actual_bags" integer DEFAULT 0,
	"defect_bags" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"speed_rpm" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_g_weigher" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_G_WEIGHER' NOT NULL,
	"target_packs" integer DEFAULT 0,
	"actual_packs" integer DEFAULT 0,
	"reject_count" integer DEFAULT 0,
	"avg_weight" double precision DEFAULT 0,
	"min_weight" double precision DEFAULT 0,
	"max_weight" double precision DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_h_bagmaker" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_H_BAGMAKER' NOT NULL,
	"target_bags" integer DEFAULT 0,
	"actual_bags" integer DEFAULT 0,
	"defect_bags" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"speed_rpm" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_h_weigher" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_H_WEIGHER' NOT NULL,
	"target_packs" integer DEFAULT 0,
	"actual_packs" integer DEFAULT 0,
	"reject_count" integer DEFAULT 0,
	"avg_weight" double precision DEFAULT 0,
	"min_weight" double precision DEFAULT 0,
	"max_weight" double precision DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_i_bagmaker" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_I_BAGMAKER' NOT NULL,
	"target_bags" integer DEFAULT 0,
	"actual_bags" integer DEFAULT 0,
	"defect_bags" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"speed_rpm" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packing_line_i_weigher" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_I_WEIGHER' NOT NULL,
	"target_packs" integer DEFAULT 0,
	"actual_packs" integer DEFAULT 0,
	"reject_count" integer DEFAULT 0,
	"avg_weight" double precision DEFAULT 0,
	"min_weight" double precision DEFAULT 0,
	"max_weight" double precision DEFAULT 0,
	"status" text DEFAULT 'idle',
	"efficiency" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "production_line_a_copack" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_A_COPACK' NOT NULL,
	"target_production" integer DEFAULT 0,
	"actual_production" integer DEFAULT 0,
	"defect_count" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"oee_percentage" double precision DEFAULT 0,
	"availability" double precision DEFAULT 0,
	"performance" double precision DEFAULT 0,
	"quality" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "production_line_a_fcp" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_A_FCP' NOT NULL,
	"target_production" integer DEFAULT 0,
	"actual_production" integer DEFAULT 0,
	"defect_count" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"oee_percentage" double precision DEFAULT 0,
	"availability" double precision DEFAULT 0,
	"performance" double precision DEFAULT 0,
	"quality" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "production_line_a_ihp" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_A_IHP' NOT NULL,
	"target_production" integer DEFAULT 0,
	"actual_production" integer DEFAULT 0,
	"defect_count" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"oee_percentage" double precision DEFAULT 0,
	"availability" double precision DEFAULT 0,
	"performance" double precision DEFAULT 0,
	"quality" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "production_line_a_pc14" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_A_PC14' NOT NULL,
	"target_production" integer DEFAULT 0,
	"actual_production" integer DEFAULT 0,
	"defect_count" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"oee_percentage" double precision DEFAULT 0,
	"availability" double precision DEFAULT 0,
	"performance" double precision DEFAULT 0,
	"quality" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "production_line_a_pc39" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_A_PC39' NOT NULL,
	"target_production" integer DEFAULT 0,
	"actual_production" integer DEFAULT 0,
	"defect_count" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"oee_percentage" double precision DEFAULT 0,
	"availability" double precision DEFAULT 0,
	"performance" double precision DEFAULT 0,
	"quality" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "production_line_a_ts1000" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_A_TS1000' NOT NULL,
	"target_production" integer DEFAULT 0,
	"actual_production" integer DEFAULT 0,
	"defect_count" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"oee_percentage" double precision DEFAULT 0,
	"availability" double precision DEFAULT 0,
	"performance" double precision DEFAULT 0,
	"quality" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "production_line_a_tws56" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_A_TWS56' NOT NULL,
	"target_production" integer DEFAULT 0,
	"actual_production" integer DEFAULT 0,
	"defect_count" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"oee_percentage" double precision DEFAULT 0,
	"availability" double precision DEFAULT 0,
	"performance" double precision DEFAULT 0,
	"quality" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "production_line_a_tws72" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"line_id" text DEFAULT 'LINE_A_TWS72' NOT NULL,
	"target_production" integer DEFAULT 0,
	"actual_production" integer DEFAULT 0,
	"defect_count" integer DEFAULT 0,
	"status" text DEFAULT 'idle',
	"oee_percentage" double precision DEFAULT 0,
	"availability" double precision DEFAULT 0,
	"performance" double precision DEFAULT 0,
	"quality" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
