import express from "express";
import "dotenv/config";
import cors from "cors";
import userController from "./user/user.controller";
import lvmdp1Controller from "./lvmdp/LVMDP_1/lvmdp_1.controller";
import lvmdp2Controller from "./lvmdp/LVMDP_2/lvmdp_2.controller";
import lvmdp3Controller from "./lvmdp/LVMDP_3/lvmdp_3.controller";
import lvmdp4Controller from "./lvmdp/LVMDP_4/lvmdp_4.controller";
import lvmdp1DailyReportController from "./lvmdp/LVMDP_1/lvmdp_1.dailyReport.controller";
import lvmdp2DailyReportController from "./lvmdp/LVMDP_2/lvmdp_2.dailyReport.controller";
import lvmdp3DailyReportController from "./lvmdp/LVMDP_3/lvmdp_3.dailyReport.controller";
import lvmdp4DailyReportController from "./lvmdp/LVMDP_4/lvmdp_4.dailyReport.controller";
import productionController from "./production/production.controller";
import packingController from "./packing/packing.controller";
import dailyReportRouter from "./routes/dailyReport.router";
import "./utils/pgTimezoneFix";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:30",
      "http://localhost:31",
    ],
    credentials: true,
  })
);

// Disable caching for all API responses
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// const PORT = Number(process.env.PORT);

app.get("/api", (_req, res) => {
  res.send("Sukses landing ke endpoint api");
});

app.use("/api/lvmdp", require("./routes/lvmdp.router").default);

app.use("/api/user", userController);
app.use("/api/lvmdp1", lvmdp1Controller);
app.use("/api/lvmdp1/daily-report", lvmdp1DailyReportController);
app.use("/api/lvmdp2", lvmdp2Controller);
app.use("/api/lvmdp2/daily-report", lvmdp2DailyReportController);
app.use("/api/lvmdp3", lvmdp3Controller);
app.use("/api/lvmdp3/daily-report", lvmdp3DailyReportController);
app.use("/api/lvmdp4", lvmdp4Controller);
app.use("/api/lvmdp4/daily-report", lvmdp4DailyReportController);

// Production & Packing routes
app.use("/api/production", productionController);
app.use("/api/packing", packingController);

// Daily Report routes
app.use("/api/daily-report", dailyReportRouter);

// Hourly Report routes
import hourlyReportRouter from "./routes/hourlyReport.router";
app.use("/api/hourly-report", hourlyReportRouter);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

export default app;
