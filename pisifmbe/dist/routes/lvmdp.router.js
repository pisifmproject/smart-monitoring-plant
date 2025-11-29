"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/lvmdp.router.ts
const express_1 = require("express");
const lvmdp_1_repository_1 = require("../lvmdp/LVMDP_1/lvmdp_1.repository");
const lvmdp_2_repository_1 = require("../lvmdp/LVMDP_2/lvmdp_2.repository");
const lvmdp_3_repository_1 = require("../lvmdp/LVMDP_3/lvmdp_3.repository");
const lvmdp_4_repository_1 = require("../lvmdp/LVMDP_4/lvmdp_4.repository");
const r = (0, express_1.Router)();
// Peta fungsi repository per panel
const REPO_FUNCTIONS = {
    1: lvmdp_1_repository_1.findLatestLVMDP1,
    2: lvmdp_2_repository_1.findLatestLVMDP2,
    3: lvmdp_3_repository_1.findLatestLVMDP3,
    4: lvmdp_4_repository_1.findLatestLVMDP4,
};
// GET /api/lvmdp/:id/latest
r.get("/:id/latest", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (![1, 2, 3, 4].includes(id)) {
            return res.status(400).json({ message: "Bad id (must be 1..4)" });
        }
        const findLatest = REPO_FUNCTIONS[id];
        if (!findLatest) {
            return res.status(500).json({ message: "Repository not found" });
        }
        const row = await findLatest();
        if (!row) {
            return res.status(404).json({ message: "No data" });
        }
        return res.json({
            waktu: row.waktu,
            totalKwh: row.totalKwh,
            cosPhi: row.cosPhi,
            freq: row.freq,
            avgLineLine: row.avgLineLine,
            avgLineNeut: row.avgLineNeut,
            avgCurrent: row.avgCurrent,
        });
    }
    catch (err) {
        console.error("GET /lvmdp/:id/latest error:", err);
        return res
            .status(500)
            .json({ message: "Internal server error", error: String(err) });
    }
});
exports.default = r;
