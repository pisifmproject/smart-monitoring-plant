// frontend/src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../stores/auth";
import Landing from "../views/landing.vue";
import Login from "../views/login.vue";
import GlobalDashboard from "../views/GlobalDashboard.vue";
import PlantDashboard from "../views/PlantDashboard.vue";
import ProductionLinesOverview from "../views/ProductionLinesOverview.vue";
import UtilityDashboard from "../views/UtilityDashboard.vue";
import SteamDashboard from "../views/utilities/SteamDashboard.vue";
import WaterDashboard from "../views/utilities/WaterDashboard.vue";
import CompressedAirDashboard from "../views/utilities/CompressedAirDashboard.vue";
import NitrogenDashboard from "../views/utilities/NitrogenDashboard.vue";
import NaturalGasDashboard from "../views/utilities/NaturalGasDashboard.vue";
import DashboardLayout from "../layouts/dashboardLayout.vue";
import UtilityConsumption from "../views/utility/utilityConsumption.vue";
import SummaryPanelDashboard from "../views/summary/SummaryPanelDashboard.vue";

// New Electrical and LVMDP components
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
const ProductionFCPDailyReport = () =>
  import("../views/dailyReport/production/productionFCPDailyReport.vue");
const ProductionTWS56DailyReport = () =>
  import("../views/dailyReport/production/productionTWS56DailyReport.vue");
const ProductionTWS72DailyReport = () =>
  import("../views/dailyReport/production/productionTWS72DailyReport.vue");
const ProductionCOPACKDailyReport = () =>
  import("../views/dailyReport/production/productionCOPACKDailyReport.vue");
const ProductionCassavaInhouseDailyReport = () =>
  import(
    "../views/dailyReport/production/productionCassavaInhouseDailyReport.vue"
  );
const ProductionTortilaDailyReport = () =>
  import("../views/dailyReport/production/productionTortilaDailyReport.vue");
const ProductionPackingPouchDailyReport = () =>
  import(
    "../views/dailyReport/production/productionPackingPouchDailyReport.vue"
  );
const ProductionVacuumFryerDailyReport = () =>
  import(
    "../views/dailyReport/production/productionVacuumFryerDailyReport.vue"
  );
const WeigherPC14DailyReport = () =>
  import("../views/dailyReport/weigher/weigherPC14DailyReport.vue");
const WeigherPC39DailyReport = () =>
  import("../views/dailyReport/weigher/weigherPC39DailyReport.vue");
const WeigherCassavaInhouseDailyReport = () =>
  import("../views/dailyReport/weigher/weigherCassavaInhouseDailyReport.vue");
const WeigherCassavaCopackDailyReport = () =>
  import("../views/dailyReport/weigher/weigherCassavaCopackDailyReport.vue");
const WeigherTortilaDailyReport = () =>
  import("../views/dailyReport/weigher/weigherTortilaDailyReport.vue");
const WeigherFCPDailyReport = () =>
  import("../views/dailyReport/weigher/weigherFCPDailyReport.vue");
const WeigherTWS56DailyReport = () =>
  import("../views/dailyReport/weigher/weigherTWS56DailyReport.vue");
const WeigherTWS72DailyReport = () =>
  import("../views/dailyReport/weigher/weigherTWS72DailyReport.vue");
const WeigherPackingPouchDailyReport = () =>
  import("../views/dailyReport/weigher/weigherPackingPouchDailyReport.vue");

const BagmakerPC14DailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerPC14DailyReport.vue");
const BagmakerPC39DailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerPC39DailyReport.vue");
const BagmakerCassavaInhouseDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerCassavaInhouseDailyReport.vue");
const BagmakerCassavaCopackDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerCassavaCopackDailyReport.vue");
const BagmakerTortilaDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerTortilaDailyReport.vue");
const BagmakerFCPDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerFCPDailyReport.vue");
const BagmakerTWS56DailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerTWS56DailyReport.vue");
const BagmakerTWS72DailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerTWS72DailyReport.vue");
const BagmakerPackingPouchDailyReport = () =>
  import("../views/dailyReport/bagmaker/bagmakerPackingPouchDailyReport.vue");

// --- Production pages
const PC39 = () => import("../views/production/pc39.vue");
const PC14 = () => import("../views/production/pc14.vue");
const FCP = () => import("../views/production/fcp.vue");
const TWS56 = () => import("../views/production/tws56.vue");
const TWS72 = () => import("../views/production/tws72.vue");
const COPACK = () => import("../views/production/copack.vue");
const CassavaInhouse = () => import("../views/production/cassavaInhouse.vue");
const Tortila = () => import("../views/production/tortila.vue");
const PackingPouch = () => import("../views/production/packingPouch.vue");
const VacuumFryer = () => import("../views/production/vacuumFryer.vue");

// --- Packing pages
// Weigher views
const WeigherPC14 = () => import("../views/packing/weigher/weigherPC14.vue");
const WeigherPC39 = () => import("../views/packing/weigher/weigherPC39.vue");
const WeigherCassavaInhouse = () =>
  import("../views/packing/weigher/weigherCassavaInhouse.vue");
const WeigherCassavaCopack = () =>
  import("../views/packing/weigher/weigherCassavaCopack.vue");
const WeigherTortila = () =>
  import("../views/packing/weigher/weigherTortila.vue");
const WeigherFCP = () => import("../views/packing/weigher/weigherFCP.vue");
const WeigherTWS56 = () => import("../views/packing/weigher/weigherTWS56.vue");
const WeigherTWS72 = () => import("../views/packing/weigher/weigherTWS72.vue");
const WeigherPackingPouch = () =>
  import("../views/packing/weigher/weigherPackingPouch.vue");

// BagMaker views
const BagMakerPC14 = () => import("../views/packing/bagmaker/bagmakerPC14.vue");
const BagMakerPC39 = () => import("../views/packing/bagmaker/bagmakerPC39.vue");
const BagMakerCassavaInhouse = () =>
  import("../views/packing/bagmaker/bagmakerCassavaInhouse.vue");
const BagMakerCassavaCopack = () =>
  import("../views/packing/bagmaker/bagmakerCassavaCopack.vue");
const BagMakerTortila = () =>
  import("../views/packing/bagmaker/bagmakerTortila.vue");
const BagMakerFCP = () => import("../views/packing/bagmaker/bagmakerFCP.vue");
const BagMakerTWS56 = () =>
  import("../views/packing/bagmaker/bagmakerTWS56.vue");
const BagMakerTWS72 = () =>
  import("../views/packing/bagmaker/bagmakerTWS72.vue");
const BagMakerPackingPouch = () =>
  import("../views/packing/bagmaker/bagmakerPackingPouch.vue");

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
        { path: "", redirect: "/app/global" },
        { path: "global", name: "global", component: GlobalDashboard },
        { path: "plant/:plantId", name: "plantDashboard", component: PlantDashboard },
        { path: "plant/:plantId/utilities", name: "plantUtilities", component: UtilityDashboard },

        // --- NEW & CORRECTED ELECTRICAL ROUTES ---
        {
          path: "plant/:plantId/electrical/dashboard",
          name: "electricalDashboard",
          component: SummaryPanelDashboard,
        },
        {
          path: "plant/:plantId/electrical/lvmdp1",
          name: "lvmdp1",
          component: Lvmdp1,
        },
        {
          path: "plant/:plantId/electrical/lvmdp2",
          name: "lvmdp2",
          component: Lvmdp2,
        },
        {
          path: "plant/:plantId/electrical/lvmdp3",
          name: "lvmdp3",
          component: Lvmdp3,
        },
        {
          path: "plant/:plantId/electrical/lvmdp4",
          name: "lvmdp4",
          component: Lvmdp4,
        },
        {
          path: "plant/:plantId/electrical/daily-report",
          name: "lvmdpDailyReport",
          component: LvmdpDailyReport,
        },

        // --- EXISTING UTILITY ROUTES ---
        { path: "plant/:plantId/utilities/steam", name: "plantSteam", component: SteamDashboard },
        { path: "plant/:plantId/utilities/water", name: "plantWater", component: WaterDashboard },
        { path: "plant/:plantId/utilities/compressed-air", name: "plantCompressedAir", component: CompressedAirDashboard },
        { path: "plant/:plantId/utilities/nitrogen", name: "plantNitrogen", component: NitrogenDashboard },
        { path: "plant/:plantId/utilities/natural-gas", name: "plantNaturalGas", component: NaturalGasDashboard },

        // --- EXISTING PRODUCTION, PACKING, and DAILY REPORT ROUTES ---
        {
          path: "plant/:plantId/production",
          name: "plantProduction",
          component: ProductionLinesOverview,
        },
        { path: "production/pc14", name: "pc14", component: PC14 },
        { path: "production/pc39", name: "pc39", component: PC39 },
        { path: "production/cassava-inhouse", name: "cassavaInhouse", component: CassavaInhouse },
        { path: "production/copack", name: "copack", component: COPACK },
        { path: "production/tortila", name: "tortila", component: Tortila },
        { path: "production/fcp", name: "fcp", component: FCP },
        { path: "production/tws56", name: "tws56", component: TWS56 },
        { path: "production/tws72", name: "tws72", component: TWS72 },
        { path: "production/packing-pouch", name: "packingPouch", component: PackingPouch },
        { path: "production/vacuum-fryer", name: "vacuumFryer", component: VacuumFryer },
        { path: "packing/weigher-pc14", name: "weigherPC14", component: WeigherPC14, meta: { requiresUser: true } },
        { path: "packing/weigher-pc39", name: "weigherPC39", component: WeigherPC39, meta: { requiresUser: true } },
        { path: "packing/weigher-cassava-inhouse", name: "weigherCassavaInhouse", component: WeigherCassavaInhouse, meta: { requiresUser: true } },
        { path: "packing/weigher-cassava-copack", name: "weigherCassavaCopack", component: WeigherCassavaCopack, meta: { requiresUser: true } },
        { path: "packing/weigher-tortila", name: "weigherTortila", component: WeigherTortila, meta: { requiresUser: true } },
        { path: "packing/weigher-fcp", name: "weigherFCP", component: WeigherFCP, meta: { requiresUser: true } },
        { path: "packing/weigher-tws56", name: "weigherTWS56", component: WeigherTWS56, meta: { requiresUser: true } },
        { path: "packing/weigher-tws72", name: "weigherTWS72", component: WeigherTWS72, meta: { requiresUser: true } },
        { path: "packing/weigher-packing-pouch", name: "weigherPackingPouch", component: WeigherPackingPouch, meta: { requiresUser: true } },
        { path: "packing/bagmaker-pc14", name: "bagmakerPC14", component: BagMakerPC14, meta: { requiresUser: true } },
        { path: "packing/bagmaker-pc39", name: "bagmakerPC39", component: BagMakerPC39, meta: { requiresUser: true } },
        { path: "packing/bagmaker-cassava-inhouse", name: "bagmakerCassavaInhouse", component: BagMakerCassavaInhouse, meta: { requiresUser: true } },
        { path: "packing/bagmaker-cassava-copack", name: "bagmakerCassavaCopack", component: BagMakerCassavaCopack, meta: { requiresUser: true } },
        { path: "packing/bagmaker-tortila", name: "bagmakerTortila", component: BagMakerTortila, meta: { requiresUser: true } },
        { path: "packing/bagmaker-fcp", name: "bagmakerFCP", component: BagMakerFCP, meta: { requiresUser: true } },
        { path: "packing/bagmaker-tws56", name: "bagmakerTWS56", component: BagMakerTWS56, meta: { requiresUser: true } },
        { path: "packing/bagmaker-tws72", name: "bagmakerTWS72", component: BagMakerTWS72, meta: { requiresUser: true } },
        { path: "packing/bagmaker-packing-pouch", name: "bagmakerPackingPouch", component: BagMakerPackingPouch, meta: { requiresUser: true } },
        { path: "daily-report/production/pc39", name: "dailyReportPC39", component: ProductionPC39DailyReport, meta: { requiresUser: true } },
        { path: "daily-report/production/pc14", name: "dailyReportPC14", component: ProductionPC14DailyReport, meta: { requiresUser: true } },
        { path: "daily-report/production/fcp", name: "dailyReportFCP", component: ProductionFCPDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/production/tws56", name: "dailyReportTWS56", component: ProductionTWS56DailyReport, meta: { requiresUser: true } },
        { path: "daily-report/production/tws72", name: "dailyReportTWS72", component: ProductionTWS72DailyReport, meta: { requiresUser: true } },
        { path: "daily-report/production/copack", name: "dailyReportCOPACK", component: ProductionCOPACKDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/production/cassava-inhouse", name: "dailyReportCassavaInhouse", component: ProductionCassavaInhouseDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/production/tortila", name: "dailyReportTortila", component: ProductionTortilaDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/production/packing-pouch", name: "dailyReportPackingPouch", component: ProductionPackingPouchDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/production/vacuum-fryer", name: "dailyReportVacuumFryer", component: ProductionVacuumFryerDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/weigher/weigher-pc14", name: "dailyReportWeigherPC14", component: WeigherPC14DailyReport, meta: { requiresUser: true } },
        { path: "daily-report/weigher/weigher-pc39", name: "dailyReportWeigherPC39", component: WeigherPC39DailyReport, meta: { requiresUser: true } },
        { path: "daily-report/weigher/weigher-cassava-inhouse", name: "dailyReportWeigherCassavaInhouse", component: WeigherCassavaInhouseDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/weigher/weigher-cassava-copack", name: "dailyReportWeigherCassavaCopack", component: WeigherCassavaCopackDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/weigher/weigher-tortila", name: "dailyReportWeigherTortila", component: WeigherTortilaDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/weigher/weigher-fcp", name: "dailyReportWeigherFCP", component: WeigherFCPDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/weigher/weigher-tws56", name: "dailyReportWeigherTWS56", component: WeigherTWS56DailyReport, meta: { requiresUser: true } },
        { path: "daily-report/weigher/weigher-tws72", name: "dailyReportWeigherTWS72", component: WeigherTWS72DailyReport, meta: { requiresUser: true } },
        { path: "daily-report/weigher/weigher-packing-pouch", name: "dailyReportWeigherPackingPouch", component: WeigherPackingPouchDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/bagmaker/bagmaker-pc14", name: "dailyReportBagmakerPC14", component: BagmakerPC14DailyReport, meta: { requiresUser: true } },
        { path: "daily-report/bagmaker/bagmaker-pc39", name: "dailyReportBagmakerPC39", component: BagmakerPC39DailyReport, meta: { requiresUser: true } },
        { path: "daily-report/bagmaker/bagmaker-cassava-inhouse", name: "dailyReportBagmakerCassavaInhouse", component: BagmakerCassavaInhouseDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/bagmaker/bagmaker-cassava-copack", name: "dailyReportBagmakerCassavaCopack", component: BagmakerCassavaCopackDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/bagmaker/bagmaker-tortila", name: "dailyReportBagmakerTortila", component: BagmakerTortilaDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/bagmaker/bagmaker-fcp", name: "dailyReportBagmakerFCP", component: BagmakerFCPDailyReport, meta: { requiresUser: true } },
        { path: "daily-report/bagmaker/bagmaker-tws56", name: "dailyReportBagmakerTWS56", component: BagmakerTWS56DailyReport, meta: { requiresUser: true } },
        { path: "daily-report/bagmaker/bagmaker-tws72", name: "dailyReportBagmakerTWS72", component: BagmakerTWS72DailyReport, meta: { requiresUser: true } },
        { path: "daily-report/bagmaker/bagmaker-packing-pouch", name: "dailyReportBagmakerPackingPouch", component: BagmakerPackingPouchDailyReport, meta: { requiresUser: true } },
      ],
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const { isAuthenticated, initAuth } = useAuth();
  initAuth();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated.value) {
      next({ name: "login", query: { redirect: to.fullPath }, replace: true });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
