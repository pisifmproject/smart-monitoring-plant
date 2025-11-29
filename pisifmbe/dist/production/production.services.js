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
exports.createProductionData = exports.getShiftSummary = exports.calculateOEE = exports.getProductionByDateRange = exports.getLatestProduction = exports.getAllProduction = void 0;
// src/production/production.services.ts
const repo = __importStar(require("./production.repository"));
/* ===========================
   BASIC READ OPERATIONS
=========================== */
const getAllProduction = async (limit = 100) => {
    return await repo.findAllProduction(limit);
};
exports.getAllProduction = getAllProduction;
const getLatestProduction = async () => {
    return await repo.findLatestProduction();
};
exports.getLatestProduction = getLatestProduction;
const getProductionByDateRange = async (startDate, endDate) => {
    return await repo.findProductionByDateRange(startDate, endDate);
};
exports.getProductionByDateRange = getProductionByDateRange;
/* ===========================
   CALCULATIONS & ANALYTICS
=========================== */
// Calculate OEE (Overall Equipment Effectiveness)
const calculateOEE = (availability, performance, quality) => {
    return (availability * performance * quality) / 10000; // Convert from percentage
};
exports.calculateOEE = calculateOEE;
// Calculate shift summary untuk production
const getShiftSummary = async (date) => {
    // TODO: Implement shift-based calculation similar to LVMDP
    // For now, return dummy data
    const targetDate = date ? new Date(date) : new Date();
    return {
        shift1: {
            targetProduction: 1000,
            actualProduction: 950,
            defectCount: 10,
            oee: 92.5,
        },
        shift2: {
            targetProduction: 1000,
            actualProduction: 980,
            defectCount: 5,
            oee: 95.0,
        },
        shift3: {
            targetProduction: 1000,
            actualProduction: 920,
            defectCount: 15,
            oee: 89.0,
        },
    };
};
exports.getShiftSummary = getShiftSummary;
/* ===========================
   WRITE OPERATIONS
=========================== */
const createProductionData = async (data) => {
    return await repo.insertProduction(data);
};
exports.createProductionData = createProductionData;
