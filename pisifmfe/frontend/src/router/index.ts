// frontend\src\router\index.ts
import { createRouter, createWebHistory } from "vue-router";

const Landing = () => import("../views/landing.vue");
const DashboardLayout = () => import("../layouts/dashboardLayout.vue");
const DailyReport = () => import("../views/dailyReport.vue");

// Daily Report pages
const ProductionPC39DailyReport = () =>
  import("../views/dailyReport/productionPC39DailyReport.vue");
const ProductionPC14DailyReport = () =>
  import("../views/dailyReport/productionPC14DailyReport.vue");
const ProductionTS1000DailyReport = () =>
  import("../views/dailyReport/productionTS1000DailyReport.vue");
const ProductionFCPDailyReport = () =>
  import("../views/dailyReport/productionFCPDailyReport.vue");
const ProductionTWS56DailyReport = () =>
  import("../views/dailyReport/productionTWS56DailyReport.vue");
const ProductionTWS72DailyReport = () =>
  import("../views/dailyReport/productionTWS72DailyReport.vue");
const ProductionCOPACKDailyReport = () =>
  import("../views/dailyReport/productionCOPACKDailyReport.vue");
const ProductionIHPDailyReport = () =>
  import("../views/dailyReport/productionIHPDailyReport.vue");
const WeigherADailyReport = () =>
  import("../views/dailyReport/weigherADailyReport.vue");
const WeigherBDailyReport = () =>
  import("../views/dailyReport/weigherBDailyReport.vue");
const WeigherCDailyReport = () =>
  import("../views/dailyReport/weigherCDailyReport.vue");
const WeigherDDailyReport = () =>
  import("../views/dailyReport/weigherDDailyReport.vue");
const WeigherEDailyReport = () =>
  import("../views/dailyReport/weigherEDailyReport.vue");
const WeigherFDailyReport = () =>
  import("../views/dailyReport/weigherFDailyReport.vue");
const WeigherGDailyReport = () =>
  import("../views/dailyReport/weigherGDailyReport.vue");
const WeigherHDailyReport = () =>
  import("../views/dailyReport/weigherHDailyReport.vue");
const WeigherIDailyReport = () =>
  import("../views/dailyReport/weigherIDailyReport.vue");

const BagmakerADailyReport = () =>
  import("../views/dailyReport/bagmakerADailyReport.vue");
const BagmakerBDailyReport = () =>
  import("../views/dailyReport/bagmakerBDailyReport.vue");
const BagmakerCDailyReport = () =>
  import("../views/dailyReport/bagmakerCDailyReport.vue");
const BagmakerDDailyReport = () =>
  import("../views/dailyReport/bagmakerDDailyReport.vue");
const BagmakerEDailyReport = () =>
  import("../views/dailyReport/bagmakerEDailyReport.vue");
const BagmakerFDailyReport = () =>
  import("../views/dailyReport/bagmakerFDailyReport.vue");
const BagmakerGDailyReport = () =>
  import("../views/dailyReport/bagmakerGDailyReport.vue");
const BagmakerHDailyReport = () =>
  import("../views/dailyReport/bagmakerHDailyReport.vue");
const BagmakerIDailyReport = () =>
  import("../views/dailyReport/bagmakerIDailyReport.vue");

// --- LVMDP pages
const Lvmdp1 = () => import("../views/lvmdp/lvmdp1.vue");
const Lvmdp2 = () => import("../views/lvmdp/lvmdp2.vue");
const Lvmdp3 = () => import("../views/lvmdp/lvmdp3.vue");
const Lvmdp4 = () => import("../views/lvmdp/lvmdp4.vue");

// --- Production pages
const PC39 = () => import("../views/production/pc39.vue");
const PC14 = () => import("../views/production/pc14.vue");
const TS1000 = () => import("../views/production/ts1000.vue");
const FCP = () => import("../views/production/fcp.vue");
const TWS56 = () => import("../views/production/tws56.vue");
const TWS72 = () => import("../views/production/tws72.vue");
const COPACK = () => import("../views/production/copack.vue");
const IHP = () => import("../views/production/ihp.vue");

// --- Packing pages
// Weigher views
const WeigherA = () => import("../views/packing/weigherA.vue");
const WeigherB = () => import("../views/packing/weigherB.vue");
const WeigherC = () => import("../views/packing/weigherC.vue");
const WeigherD = () => import("../views/packing/weigherD.vue");
const WeigherE = () => import("../views/packing/weigherE.vue");
const WeigherF = () => import("../views/packing/weigherF.vue");
const WeigherG = () => import("../views/packing/weigherG.vue");
const WeigherH = () => import("../views/packing/weigherH.vue");
const WeigherI = () => import("../views/packing/weigherI.vue");

// BagMaker views
const BagMakerA = () => import("../views/packing/bagmakerA.vue");
const BagMakerB = () => import("../views/packing/bagmakerB.vue");
const BagMakerC = () => import("../views/packing/bagmakerC.vue");
const BagMakerD = () => import("../views/packing/bagmakerD.vue");
const BagMakerE = () => import("../views/packing/bagmakerE.vue");
const BagMakerF = () => import("../views/packing/bagmakerF.vue");
const BagMakerG = () => import("../views/packing/bagmakerG.vue");
const BagMakerH = () => import("../views/packing/bagmakerH.vue");
const BagMakerI = () => import("../views/packing/bagmakerI.vue");

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "landing", component: Landing },
    {
      path: "/app",
      component: DashboardLayout,
      children: [
        // LVMDP routes
        { path: "lvmdp1", name: "lvmdp1", component: Lvmdp1 },
        { path: "lvmdp2", name: "lvmdp2", component: Lvmdp2 },
        { path: "lvmdp3", name: "lvmdp3", component: Lvmdp3 },
        { path: "lvmdp4", name: "lvmdp4", component: Lvmdp4 },
        { path: "daily-report", name: "dailyReport", component: DailyReport },

        // Production routes
        { path: "production/pc39", name: "pc39", component: PC39 },
        { path: "production/pc14", name: "pc14", component: PC14 },
        { path: "production/ts1000", name: "ts1000", component: TS1000 },
        { path: "production/fcp", name: "fcp", component: FCP },
        { path: "production/tws56", name: "tws56", component: TWS56 },
        { path: "production/tws72", name: "tws72", component: TWS72 },
        { path: "production/copack", name: "copack", component: COPACK },
        { path: "production/ihp", name: "ihp", component: IHP },

        // Packing routes - Weigher
        {
          path: "packing/line-a-weigher",
          name: "weigherA",
          component: WeigherA,
        },
        {
          path: "packing/line-b-weigher",
          name: "weigherB",
          component: WeigherB,
        },
        {
          path: "packing/line-c-weigher",
          name: "weigherC",
          component: WeigherC,
        },
        {
          path: "packing/line-d-weigher",
          name: "weigherD",
          component: WeigherD,
        },
        {
          path: "packing/line-e-weigher",
          name: "weigherE",
          component: WeigherE,
        },
        {
          path: "packing/line-f-weigher",
          name: "weigherF",
          component: WeigherF,
        },
        {
          path: "packing/line-g-weigher",
          name: "weigherG",
          component: WeigherG,
        },
        {
          path: "packing/line-h-weigher",
          name: "weigherH",
          component: WeigherH,
        },
        {
          path: "packing/line-i-weigher",
          name: "weigherI",
          component: WeigherI,
        },

        // Packing routes - BagMaker
        {
          path: "packing/line-a-bagmaker",
          name: "bagmakerA",
          component: BagMakerA,
        },
        {
          path: "packing/line-b-bagmaker",
          name: "bagmakerB",
          component: BagMakerB,
        },
        {
          path: "packing/line-c-bagmaker",
          name: "bagmakerC",
          component: BagMakerC,
        },
        {
          path: "packing/line-d-bagmaker",
          name: "bagmakerD",
          component: BagMakerD,
        },
        {
          path: "packing/line-e-bagmaker",
          name: "bagmakerE",
          component: BagMakerE,
        },
        {
          path: "packing/line-f-bagmaker",
          name: "bagmakerF",
          component: BagMakerF,
        },
        {
          path: "packing/line-g-bagmaker",
          name: "bagmakerG",
          component: BagMakerG,
        },
        {
          path: "packing/line-h-bagmaker",
          name: "bagmakerH",
          component: BagMakerH,
        },
        {
          path: "packing/line-i-bagmaker",
          name: "bagmakerI",
          component: BagMakerI,
        },

        // Daily Report routes - Production
        {
          path: "daily-report/production/pc39",
          name: "dailyReportPC39",
          component: ProductionPC39DailyReport,
        },
        {
          path: "daily-report/production/pc14",
          name: "dailyReportPC14",
          component: ProductionPC14DailyReport,
        },
        {
          path: "daily-report/production/ts1000",
          name: "dailyReportTS1000",
          component: ProductionTS1000DailyReport,
        },
        {
          path: "daily-report/production/fcp",
          name: "dailyReportFCP",
          component: ProductionFCPDailyReport,
        },
        {
          path: "daily-report/production/tws56",
          name: "dailyReportTWS56",
          component: ProductionTWS56DailyReport,
        },
        {
          path: "daily-report/production/tws72",
          name: "dailyReportTWS72",
          component: ProductionTWS72DailyReport,
        },
        {
          path: "daily-report/production/copack",
          name: "dailyReportCOPACK",
          component: ProductionCOPACKDailyReport,
        },
        {
          path: "daily-report/production/ihp",
          name: "dailyReportIHP",
          component: ProductionIHPDailyReport,
        },

        // Daily Report routes - Packing Weigher
        {
          path: "daily-report/weigher/line-a",
          name: "dailyReportWeigherA",
          component: WeigherADailyReport,
        },
        {
          path: "daily-report/weigher/line-b",
          name: "dailyReportWeigherB",
          component: WeigherBDailyReport,
        },
        {
          path: "daily-report/weigher/line-c",
          name: "dailyReportWeigherC",
          component: WeigherCDailyReport,
        },
        {
          path: "daily-report/weigher/line-d",
          name: "dailyReportWeigherD",
          component: WeigherDDailyReport,
        },
        {
          path: "daily-report/weigher/line-e",
          name: "dailyReportWeigherE",
          component: WeigherEDailyReport,
        },
        {
          path: "daily-report/weigher/line-f",
          name: "dailyReportWeigherF",
          component: WeigherFDailyReport,
        },
        {
          path: "daily-report/weigher/line-g",
          name: "dailyReportWeigherG",
          component: WeigherGDailyReport,
        },
        {
          path: "daily-report/weigher/line-h",
          name: "dailyReportWeigherH",
          component: WeigherHDailyReport,
        },
        {
          path: "daily-report/weigher/line-i",
          name: "dailyReportWeigherI",
          component: WeigherIDailyReport,
        },

        // Daily Report routes - Packing BagMaker
        {
          path: "daily-report/bagmaker/line-a",
          name: "dailyReportBagmakerA",
          component: BagmakerADailyReport,
        },
        {
          path: "daily-report/bagmaker/line-b",
          name: "dailyReportBagmakerB",
          component: BagmakerBDailyReport,
        },
        {
          path: "daily-report/bagmaker/line-c",
          name: "dailyReportBagmakerC",
          component: BagmakerCDailyReport,
        },
        {
          path: "daily-report/bagmaker/line-d",
          name: "dailyReportBagmakerD",
          component: BagmakerDDailyReport,
        },
        {
          path: "daily-report/bagmaker/line-e",
          name: "dailyReportBagmakerE",
          component: BagmakerEDailyReport,
        },
        {
          path: "daily-report/bagmaker/line-f",
          name: "dailyReportBagmakerF",
          component: BagmakerFDailyReport,
        },
        {
          path: "daily-report/bagmaker/line-g",
          name: "dailyReportBagmakerG",
          component: BagmakerGDailyReport,
        },
        {
          path: "daily-report/bagmaker/line-h",
          name: "dailyReportBagmakerH",
          component: BagmakerHDailyReport,
        },
        {
          path: "daily-report/bagmaker/line-i",
          name: "dailyReportBagmakerI",
          component: BagmakerIDailyReport,
        },
      ],
    },
  ],
});
