ALTER TABLE "packing_line_a_bagmaker" ADD COLUMN "good_bags" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" ADD COLUMN "not_good_bags" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" ADD COLUMN "total_efficiency" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" ADD COLUMN "efficiency_weigher" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" ADD COLUMN "efficiency_bagmaker" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" ADD COLUMN "metal_detect" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" ADD COLUMN "printer_error" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" ADD COLUMN "product_in_seal" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" ADD COLUMN "splice_detect" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" ADD COLUMN "actual_speed" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" ADD COLUMN "wasted_film_percentage" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "production_line_a_pc39" ADD COLUMN "kwh_meter" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "production_line_a_pc39" ADD COLUMN "power_consumption" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "production_line_a_pc39" ADD COLUMN "voltage_input" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "production_line_a_pc39" ADD COLUMN "current_ampere" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" DROP COLUMN "defect_bags";--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" DROP COLUMN "efficiency";--> statement-breakpoint
ALTER TABLE "packing_line_a_bagmaker" DROP COLUMN "speed_rpm";