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
exports.getShiftSummary = exports.getPackingSummary = exports.calculateEfficiency = exports.createBagMakerData = exports.getLatestBagMaker = exports.getAllBagMaker = exports.createWeigherData = exports.getLatestWeigher = exports.getAllWeigher = void 0;
// src/packing/packing.services.ts
const repo = __importStar(require("./packing.repository"));
/* ===========================
   WEIGHER OPERATIONS
=========================== */
const getAllWeigher = async (limit = 100) => {
    return await repo.findAllWeigher(limit);
};
exports.getAllWeigher = getAllWeigher;
const getLatestWeigher = async () => {
    return await repo.findLatestWeigher();
};
exports.getLatestWeigher = getLatestWeigher;
const createWeigherData = async (data) => {
    return await repo.insertWeigher(data);
};
exports.createWeigherData = createWeigherData;
/* ===========================
   BAGMAKER OPERATIONS
=========================== */
const getAllBagMaker = async (limit = 100) => {
    return await repo.findAllBagMaker(limit);
};
exports.getAllBagMaker = getAllBagMaker;
const getLatestBagMaker = async () => {
    return await repo.findLatestBagMaker();
};
exports.getLatestBagMaker = getLatestBagMaker;
const createBagMakerData = async (data) => {
    return await repo.insertBagMaker(data);
};
exports.createBagMakerData = createBagMakerData;
/* ===========================
   ANALYTICS & CALCULATIONS
=========================== */
// Calculate efficiency untuk packing line
const calculateEfficiency = (actual, target) => {
    if (target === 0)
        return 0;
    return (actual / target) * 100;
};
exports.calculateEfficiency = calculateEfficiency;
// Get summary for both weigher and bagmaker
const getPackingSummary = async () => {
    const weigher = await repo.findLatestWeigher();
    const bagmaker = await repo.findLatestBagMaker();
    return {
        weigher: weigher || {
            targetPacks: 0,
            actualPacks: 0,
            rejectCount: 0,
            efficiency: 0,
            status: "idle",
        },
        bagmaker: bagmaker || {
            targetBags: 0,
            actualBags: 0,
            defectBags: 0,
            efficiency: 0,
            status: "idle",
        },
    };
};
exports.getPackingSummary = getPackingSummary;
// Get shift summary untuk packing
const getShiftSummary = async (date) => {
    // TODO: Implement shift-based calculation
    // For now, return dummy data
    return {
        shift1: {
            weigher: { targetPacks: 5000, actualPacks: 4800, rejectCount: 50 },
            bagmaker: { targetBags: 5000, actualBags: 4850, defectBags: 30 },
        },
        shift2: {
            weigher: { targetPacks: 5000, actualPacks: 4900, rejectCount: 40 },
            bagmaker: { targetBags: 5000, actualBags: 4900, defectBags: 25 },
        },
        shift3: {
            weigher: { targetPacks: 5000, actualPacks: 4700, rejectCount: 60 },
            bagmaker: { targetBags: 5000, actualBags: 4750, defectBags: 40 },
        },
    };
};
exports.getShiftSummary = getShiftSummary;
