-- Migration: Add users table with authentication
-- Created: 2025-12-16

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"role" varchar(50) DEFAULT 'Viewer' NOT NULL,
	"plant_access" text[] DEFAULT '{}' NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS "idx_users_username" ON "users" ("username");

-- Create index on role for filtering
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users" ("role");
