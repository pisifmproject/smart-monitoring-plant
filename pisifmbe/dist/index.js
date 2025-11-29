"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const user_controller_1 = __importDefault(require("./user/user.controller"));
const lvmdp_1_controller_1 = __importDefault(require("./lvmdp/LVMDP_1/lvmdp_1.controller"));
const lvmdp_2_controller_1 = __importDefault(require("./lvmdp/LVMDP_2/lvmdp_2.controller"));
const lvmdp_3_controller_1 = __importDefault(require("./lvmdp/LVMDP_3/lvmdp_3.controller"));
const lvmdp_4_controller_1 = __importDefault(require("./lvmdp/LVMDP_4/lvmdp_4.controller"));
const lvmdp_1_dailyReport_controller_1 = __importDefault(require("./lvmdp/LVMDP_1/lvmdp_1.dailyReport.controller"));
const lvmdp_2_dailyReport_controller_1 = __importDefault(require("./lvmdp/LVMDP_2/lvmdp_2.dailyReport.controller"));
const lvmdp_3_dailyReport_controller_1 = __importDefault(require("./lvmdp/LVMDP_3/lvmdp_3.dailyReport.controller"));
const lvmdp_4_dailyReport_controller_1 = __importDefault(require("./lvmdp/LVMDP_4/lvmdp_4.dailyReport.controller"));
const production_controller_1 = __importDefault(require("./production/production.controller"));
const packing_controller_1 = __importDefault(require("./packing/packing.controller"));
const dailyReport_router_1 = __importDefault(require("./routes/dailyReport.router"));
require("./utils/pgTimezoneFix");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
// const PORT = Number(process.env.PORT);
app.get("/api", (_req, res) => {
    res.send("Sukses landing ke endpoint api");
});
app.use("/api/lvmdp", require("./routes/lvmdp.router").default);
app.use("/api/user", user_controller_1.default);
app.use("/api/lvmdp1", lvmdp_1_controller_1.default);
app.use("/api/lvmdp1/daily-report", lvmdp_1_dailyReport_controller_1.default);
app.use("/api/lvmdp2", lvmdp_2_controller_1.default);
app.use("/api/lvmdp2/daily-report", lvmdp_2_dailyReport_controller_1.default);
app.use("/api/lvmdp3", lvmdp_3_controller_1.default);
app.use("/api/lvmdp3/daily-report", lvmdp_3_dailyReport_controller_1.default);
app.use("/api/lvmdp4", lvmdp_4_controller_1.default);
app.use("/api/lvmdp4/daily-report", lvmdp_4_dailyReport_controller_1.default);
// Production & Packing routes
app.use("/api/production", production_controller_1.default);
app.use("/api/packing", packing_controller_1.default);
// Daily Report routes
app.use("/api/daily-report", dailyReport_router_1.default);
// Hourly Report routes
const hourlyReport_router_1 = __importDefault(require("./routes/hourlyReport.router"));
app.use("/api/hourly-report", hourlyReport_router_1.default);
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
exports.default = app;
