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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/lvmdp/LVMDP_1/lvmdp_1.controller.ts
const express_1 = __importDefault(require("express"));
const lvmdp_1_services_1 = require("./lvmdp_1.services");
const repo = __importStar(require("./lvmdp_1.repository"));
const r = express_1.default.Router();
// semua data (kalau butuh)
r.get("/", async (_req, res) => {
    const rows = await (0, lvmdp_1_services_1.getAllLVMDPs)();
    res.json(rows);
});
// data paling terbaru (untuk gauge realtime)
r.get("/latest", async (_req, res) => {
    const row = await repo.findLatestLVMDP1();
    if (!row)
        return res.status(404).json({ message: "No data" });
    res.json(row);
});
// data RST (current & voltage) dari HMI
r.get("/hmi", async (_req, res) => {
    const hmiData = await repo.findLatestHMI1();
    if (!hmiData)
        return res.status(404).json({ message: "No HMI data" });
    res.json(hmiData);
});
// rata-rata per shift (dipakai ShiftCard di frontend)
r.get("/shift-avg", async (req, res) => {
    const date = req.query.date; // optional ?date=2025-11-12
    const data = await (0, lvmdp_1_services_1.getShiftAveragesLVMDP1)(date);
    // Transform avgKwh -> avgPower untuk frontend
    const transformed = {
        shift1: {
            avgPower: data.shift1.avgKwh,
            avgCurrent: data.shift1.avgCurrent,
            minCurrent: data.shift1.minCurrent,
            maxCurrent: data.shift1.maxCurrent,
            count: data.shift1.count,
        },
        shift2: {
            avgPower: data.shift2.avgKwh,
            avgCurrent: data.shift2.avgCurrent,
            minCurrent: data.shift2.minCurrent,
            maxCurrent: data.shift2.maxCurrent,
            count: data.shift2.count,
        },
        shift3: {
            avgPower: data.shift3.avgKwh,
            avgCurrent: data.shift3.avgCurrent,
            minCurrent: data.shift3.minCurrent,
            maxCurrent: data.shift3.maxCurrent,
            count: data.shift3.count,
        },
    };
    res.json(transformed);
});
exports.default = r;
