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
// src/packing/packing.controller.ts
const express_1 = __importDefault(require("express"));
const service = __importStar(require("./packing.services"));
const r = express_1.default.Router();
/* ===========================
   WEIGHER ENDPOINTS
=========================== */
// GET /api/packing/weigher - Get all weigher data
r.get("/weigher", async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 100;
        const data = await service.getAllWeigher(limit);
        res.json(data);
    }
    catch (err) {
        console.error("GET /packing/weigher error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
// GET /api/packing/weigher/latest - Get latest weigher data
r.get("/weigher/latest", async (_req, res) => {
    try {
        const data = await service.getLatestWeigher();
        if (!data) {
            return res.status(404).json({ message: "No weigher data found" });
        }
        res.json(data);
    }
    catch (err) {
        console.error("GET /packing/weigher/latest error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
// POST /api/packing/weigher - Create new weigher data
r.post("/weigher", async (req, res) => {
    try {
        const data = await service.createWeigherData(req.body);
        if (!data) {
            return res.status(500).json({ message: "Failed to create weigher data" });
        }
        res.status(201).json(data);
    }
    catch (err) {
        console.error("POST /packing/weigher error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
/* ===========================
   BAGMAKER ENDPOINTS
=========================== */
// GET /api/packing/bagmaker - Get all bagmaker data
r.get("/bagmaker", async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 100;
        const data = await service.getAllBagMaker(limit);
        res.json(data);
    }
    catch (err) {
        console.error("GET /packing/bagmaker error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
// GET /api/packing/bagmaker/latest - Get latest bagmaker data
r.get("/bagmaker/latest", async (_req, res) => {
    try {
        const data = await service.getLatestBagMaker();
        if (!data) {
            return res.status(404).json({ message: "No bagmaker data found" });
        }
        res.json(data);
    }
    catch (err) {
        console.error("GET /packing/bagmaker/latest error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
// POST /api/packing/bagmaker - Create new bagmaker data
r.post("/bagmaker", async (req, res) => {
    try {
        const data = await service.createBagMakerData(req.body);
        if (!data) {
            return res
                .status(500)
                .json({ message: "Failed to create bagmaker data" });
        }
        res.status(201).json(data);
    }
    catch (err) {
        console.error("POST /packing/bagmaker error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
/* ===========================
   SUMMARY ENDPOINTS
=========================== */
// GET /api/packing/summary - Get summary for both weigher and bagmaker
r.get("/summary", async (_req, res) => {
    try {
        const summary = await service.getPackingSummary();
        res.json(summary);
    }
    catch (err) {
        console.error("GET /packing/summary error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
// GET /api/packing/shift-summary - Get shift summary
r.get("/shift-summary", async (req, res) => {
    try {
        const date = req.query.date;
        const summary = await service.getShiftSummary(date);
        res.json(summary);
    }
    catch (err) {
        console.error("GET /packing/shift-summary error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = r;
