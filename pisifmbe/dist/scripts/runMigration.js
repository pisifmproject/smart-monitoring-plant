"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/scripts/runMigration.ts
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function runMigration() {
    try {
        console.log("[MIGRATION] Reading migration file...");
        const migrationPath = path.join(__dirname, "../../drizzle/0007_add_hourly_report_tables.sql");
        const migrationSQL = fs.readFileSync(migrationPath, "utf-8");
        console.log("[MIGRATION] Executing migration...");
        console.log("------------------------------------");
        await db_1.db.execute(drizzle_orm_1.sql.raw(migrationSQL));
        console.log("------------------------------------");
        console.log("[MIGRATION] ✓ Migration completed successfully!");
        console.log("[MIGRATION] Created tables:");
        console.log("  - hourly_report_lvmdp_1");
        console.log("  - hourly_report_lvmdp_2");
        console.log("  - hourly_report_lvmdp_3");
        console.log("  - hourly_report_lvmdp_4");
        console.log("[MIGRATION] With indexes for optimal performance");
        process.exit(0);
    }
    catch (error) {
        console.error("[MIGRATION] ✗ Error:", error);
        process.exit(1);
    }
}
runMigration();
