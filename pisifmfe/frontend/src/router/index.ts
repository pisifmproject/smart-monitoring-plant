// frontend\src\router\index.ts
import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../stores/auth";
import Landing from "../views/landing.vue";
import Login from "../views/login.vue";
import DashboardLayout from "../layouts/dashboardLayout.vue";
import UtilityConsumption from "../views/utility/utilityConsumption.vue";
import Lvmdp1 from "../views/lvmdp/lvmdp1.vue";
import Lvmdp2 from "../views/lvmdp/lvmdp2.vue";
import Lvmdp3 from "../views/lvmdp/lvmdp3.vue";
import Lvmdp4 from "../views/lvmdp/lvmdp4.vue";
const LvmdpDailyReport = () =>
  import("../views/dailyReport/lvmdp/lvmdpDailyReport.vue");

// Daily Report pages
const ProductionPC39DailyReport = () =>
  import("../views/dailyReport/production/productionPC39DailyReport.vue");
const ProductionPC14DailyReport = () =>
  import("../views/dailyReport/production/productionPC14DailyReport.vue");
const ProductionTS1000DailyReport = () =>
  import("../views/dailyReport/production/productionTS1000DailyReport.vue");
const ProductionFCPDailyReport = () =>
  import("../views/dailyReport/production/productionFCPDailyReport.vue");
const ProductionTWS56DailyReport = () =>
  import("../views/dailyReport/production/productionTWS56DailyReport.vue");
const ProductionTWS72DailyReport = () =>
  import("../views/dailyReport/production/productionTWS72DailyReport.vue");
const ProductionCOPACKDailyReport = () =>
  import("../views/dailyReport/production/productionCOPACKDailyReport.vue");
const ProductionIHPDailyReport = () =>
  import("../views/dailyReport/production/productionIHPDailyReport.vue");
const WeigherADailyReport = () =>
  import("../views/dailyReport/weigher/weigherADailyReport.vue");
const WeigherBDailyReport = () =>
  import("../views/dailyReport/weigher/weigherBDailyReport.vue");
const WeigherCDailyReport = () =>
  import("../views/dailyReport/weigher/weigherCDailyReport.vue");
const WeigherDDailyReport = () =>
  import("../views/dailyReport/weigher/weigherDDailyReport.vue");
const WeigherEDailyReport = () =>
  import("../views/dailyReport/weigher/weigherEDailyReport.vue");
const WeigherFDailyReport = () =>
  import("../views/dailyReport/weigher/weigherFDailyReport.vue");
const WeigherGDailyReport = () =>
  import("../views/dailyReport/weigher/weigherGDailyReport.vue");
const WeigherHDailyReport = () =>
  import("../views/dailyReport/weigher/weigherHDailyReport.vue");
const WeigherIDailyReport = () =>
  import("../views/dailyReport/weigher/weigherIDailyReport.vue");

const BagmakerADailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerADailyReport.vue");
const BagmakerBDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerBDailyReport.vue");
const BagmakerCDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerCDailyReport.vue");
const BagmakerDDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerDDailyReport.vue");
const BagmakerEDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerEDailyReport.vue");
const BagmakerFDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerFDailyReport.vue");
const BagmakerGDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerGDailyReport.vue");
const BagmakerHDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerHDailyReport.vue");
const BagmakerIDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerIDailyReport.vue");

// --- Production pages
const PC39 = () => import("../views/production/pc39.vue");
const PC14 = () => import("../views/production/pc14.vue");
const TS1000 = () => import("../views/production/ts1000.vue");
const FCP = () => import("../views/production/fcp.vue");
const TWS56 = () => import("../views/production/tws56.vue");
const TWS72 = () => import("../views/production/tws72.vue");
const COPACK = () => import("../views/production/copack.vue");
const IHP = () => import("../views/production/ihp.vue");
const CassavaInhouse = () => import("../views/production/cassavaInhouse.vue");
const Tortila = () => import("../views/production/tortila.vue");
const PackingPouch = () => import("../views/production/packingPouch.vue");
const VacuumFryer = () => import("../views/production/vacuumFryer.vue");

// --- Packing pages
// Weigher views
const WeigherA = () => import("../views/packing/weigher/weigherA.vue");
const WeigherB = () => import("../views/packing/weigher/weigherB.vue");
const WeigherC = () => import("../views/packing/weigher/weigherC.vue");
const WeigherD = () => import("../views/packing/weigher/weigherD.vue");
const WeigherE = () => import("../views/packing/weigher/weigherE.vue");
const WeigherF = () => import("../views/packing/weigher/weigherF.vue");
const WeigherG = () => import("../views/packing/weigher/weigherG.vue");
const WeigherH = () => import("../views/packing/weigher/weigherH.vue");
const WeigherI = () => import("../views/packing/weigher/weigherI.vue");

// BagMaker views
const BagMakerA = () => import("../views/packing/bagmaker/bagmakerA.vue");
const BagMakerB = () => import("../views/packing/bagmaker/bagmakerB.vue");
const BagMakerC = () => import("../views/packing/bagmaker/bagmakerC.vue");
const BagMakerD = () => import("../views/packing/bagmaker/bagmakerD.vue");
const BagMakerE = () => import("../views/packing/bagmaker/bagmakerE.vue");
const BagMakerF = () => import("../views/packing/bagmaker/bagmakerF.vue");
const BagMakerG = () => import("../views/packing/bagmaker/bagmakerG.vue");
const BagMakerH = () => import("../views/packing/bagmaker/bagmakerH.vue");
const BagMakerI = () => import("../views/packing/bagmaker/bagmakerI.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "landing", component: Landing },
    { path: "/login", name: "login", component: Login },
    {
      path: "/app",
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        // LVMDP routes
        { path: "lvmdp1", name: "lvmdp1", component: Lvmdp1 },
        { path: "lvmdp2", name: "lvmdp2", component: Lvmdp2 },
        { path: "lvmdp3", name: "lvmdp3", component: Lvmdp3 },
        { path: "lvmdp4", name: "lvmdp4", component: Lvmdp4 },
        {
          path: "daily-report",
          name: "dailyReport",
          component: LvmdpDailyReport,
          meta: { requiresUser: true },
        },

        // Production routes
        { path: "production/pc14", name: "pc14", component: PC14 },
        { path: "production/pc39", name: "pc39", component: PC39 },
        {
          path: "production/cassava-inhouse",
          name: "cassavaInhouse",
          component: CassavaInhouse,
        },
        { path: "production/copack", name: "copack", component: COPACK },
        { path: "production/tortila", name: "tortila", component: Tortila },
        { path: "production/fcp", name: "fcp", component: FCP },
        { path: "production/tws56", name: "tws56", component: TWS56 },
        { path: "production/tws72", name: "tws72", component: TWS72 },
        {
          path: "production/packing-pouch",
          name: "packingPouch",
          component: PackingPouch,
        },
        {
          path: "production/vacuum-fryer",
          name: "vacuumFryer",
          component: VacuumFryer,
        },

        // Utility Consumption routes (User only)
        {
          path: "utility/pc14",
          name: "utilityPC14",
          component: UtilityConsumption,
          props: { machineName: "PC 14" },
          meta: { requiresUser: true },
        },
        {
          path: "utility/pc39",
          name: "utilityPC39",
          component: UtilityConsumption,
          props: { machineName: "PC 39" },
          meta: { requiresUser: true },
        },
        {
          path: "utility/cassava-inhouse",
          name: "utilityCassavaInhouse",
          component: UtilityConsumption,
          props: { machineName: "Cassava Inhouse" },
          meta: { requiresUser: true },
        },
        {
          path: "utility/cassava-copack",
          name: "utilityCassavaCopack",
          component: UtilityConsumption,
          props: { machineName: "Cassava Copack" },
          meta: { requiresUser: true },
        },
        {
          path: "utility/tortila",
          name: "utilityTortila",
          component: UtilityConsumption,
          props: { machineName: "Tortila" },
          meta: { requiresUser: true },
        },
        {
          path: "utility/fcp",
          name: "utilityFCP",
          component: UtilityConsumption,
          props: { machineName: "FCP" },
          meta: { requiresUser: true },
        },
        {
          path: "utility/tws56",
          name: "utilityTWS56",
          component: UtilityConsumption,
          props: { machineName: "TWS 5.6" },
          meta: { requiresUser: true },
        },
        {
          path: "utility/tws72",
          name: "utilityTWS72",
          component: UtilityConsumption,
          props: { machineName: "TWS 7.2" },
          meta: { requiresUser: true },
        },
        {
          path: "utility/packing-pouch",
          name: "utilityPackingPouch",
          component: UtilityConsumption,
          props: { machineName: "Packing Pouch (Promina Puff)" },
          meta: { requiresUser: true },
        },
        {
          path: "utility/vacuum-fryer",
          name: "utilityVacuumFryer",
          component: UtilityConsumption,
          props: { machineName: "Vacuum Fryer 1" },
          meta: { requiresUser: true },
        },

        // Packing routes - Weigher (User only)
        {
          path: "packing/line-a-weigher",
          name: "weigherA",
          component: WeigherA,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-b-weigher",
          name: "weigherB",
          component: WeigherB,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-c-weigher",
          name: "weigherC",
          component: WeigherC,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-d-weigher",
          name: "weigherD",
          component: WeigherD,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-e-weigher",
          name: "weigherE",
          component: WeigherE,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-f-weigher",
          name: "weigherF",
          component: WeigherF,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-g-weigher",
          name: "weigherG",
          component: WeigherG,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-h-weigher",
          name: "weigherH",
          component: WeigherH,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-i-weigher",
          name: "weigherI",
          component: WeigherI,
          meta: { requiresUser: true },
        },

        // Packing routes - BagMaker (User only)
        {
          path: "packing/line-a-bagmaker",
          name: "bagmakerA",
          component: BagMakerA,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-b-bagmaker",
          name: "bagmakerB",
          component: BagMakerB,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-c-bagmaker",
          name: "bagmakerC",
          component: BagMakerC,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-d-bagmaker",
          name: "bagmakerD",
          component: BagMakerD,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-e-bagmaker",
          name: "bagmakerE",
          component: BagMakerE,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-f-bagmaker",
          name: "bagmakerF",
          component: BagMakerF,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-g-bagmaker",
          name: "bagmakerG",
          component: BagMakerG,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-h-bagmaker",
          name: "bagmakerH",
          component: BagMakerH,
          meta: { requiresUser: true },
        },
        {
          path: "packing/line-i-bagmaker",
          name: "bagmakerI",
          component: BagMakerI,
          meta: { requiresUser: true },
        },

        // Daily Report routes - Production
        {
          path: "daily-report/production/pc39",
          name: "dailyReportPC39",
          component: ProductionPC39DailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/production/pc14",
          name: "dailyReportPC14",
          component: ProductionPC14DailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/production/ts1000",
          name: "dailyReportTS1000",
          component: ProductionTS1000DailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/production/fcp",
          name: "dailyReportFCP",
          component: ProductionFCPDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/production/tws56",
          name: "dailyReportTWS56",
          component: ProductionTWS56DailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/production/tws72",
          name: "dailyReportTWS72",
          component: ProductionTWS72DailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/production/copack",
          name: "dailyReportCOPACK",
          component: ProductionCOPACKDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/production/ihp",
          name: "dailyReportIHP",
          component: ProductionIHPDailyReport,
          meta: { requiresUser: true },
        },

        // Daily Report routes - Packing Weigher
        {
          path: "daily-report/weigher/line-a",
          name: "dailyReportWeigherA",
          component: WeigherADailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/weigher/line-b",
          name: "dailyReportWeigherB",
          component: WeigherBDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/weigher/line-c",
          name: "dailyReportWeigherC",
          component: WeigherCDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/weigher/line-d",
          name: "dailyReportWeigherD",
          component: WeigherDDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/weigher/line-e",
          name: "dailyReportWeigherE",
          component: WeigherEDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/weigher/line-f",
          name: "dailyReportWeigherF",
          component: WeigherFDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/weigher/line-g",
          name: "dailyReportWeigherG",
          component: WeigherGDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/weigher/line-h",
          name: "dailyReportWeigherH",
          component: WeigherHDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/weigher/line-i",
          name: "dailyReportWeigherI",
          component: WeigherIDailyReport,
          meta: { requiresUser: true },
        },

        // Daily Report routes - Packing BagMaker
        {
          path: "daily-report/bagmaker/line-a",
          name: "dailyReportBagmakerA",
          component: BagmakerADailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/bagmaker/line-b",
          name: "dailyReportBagmakerB",
          component: BagmakerBDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/bagmaker/line-c",
          name: "dailyReportBagmakerC",
          component: BagmakerCDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/bagmaker/line-d",
          name: "dailyReportBagmakerD",
          component: BagmakerDDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/bagmaker/line-e",
          name: "dailyReportBagmakerE",
          component: BagmakerEDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/bagmaker/line-f",
          name: "dailyReportBagmakerF",
          component: BagmakerFDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/bagmaker/line-g",
          name: "dailyReportBagmakerG",
          component: BagmakerGDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/bagmaker/line-h",
          name: "dailyReportBagmakerH",
          component: BagmakerHDailyReport,
          meta: { requiresUser: true },
        },
        {
          path: "daily-report/bagmaker/line-i",
          name: "dailyReportBagmakerI",
          component: BagmakerIDailyReport,
          meta: { requiresUser: true },
        },
      ],
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const { isAuthenticated, canAccessDailyReport, initAuth } = useAuth();

  // Initialize auth from localStorage
  initAuth();

  // Check if route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated.value) {
      // Redirect to login if not authenticated
      next({ name: "login", query: { redirect: to.fullPath } });
      return;
    }
  }

  // Check if route requires user role (for daily reports, weigher, bagmaker)
  if (to.matched.some((record) => record.meta.requiresUser)) {
    if (!isAuthenticated.value) {
      next({ name: "login", query: { redirect: to.fullPath } });
      return;
    }

    if (!canAccessDailyReport()) {
      // Guest cannot access restricted features
      const routePath = to.path;
      let message = "⚠️ Akses Ditolak\n\n";

      if (routePath.includes("daily-report")) {
        message += "Silakan login sebagai User untuk akses penuh.";
      } else if (
        routePath.includes("weigher") ||
        routePath.includes("bagmaker")
      ) {
        message += "Silakan login sebagai User untuk akses penuh.";
      } else {
        message += "Silakan login sebagai User untuk akses penuh.";
      }

      alert(message);
      next({ name: "lvmdp1" });
      return;
    }
  }

  next();
});

export default router;
