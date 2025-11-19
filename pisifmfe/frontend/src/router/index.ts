// frontend\src\router\index.ts
import { createRouter, createWebHistory } from "vue-router";

const Landing = () => import("../views/landing.vue");
const DashboardLayout = () => import("../layouts/dashboardLayout.vue");

// --- Tambahan halaman LVMDP 1-4 (lazy-loaded)
const Lvmdp1 = () => import("../views/lvmdp1.vue");
const Lvmdp2 = () => import("../views/lvmdp2.vue");
const Lvmdp3 = () => import("../views/lvmdp3.vue");
const Lvmdp4 = () => import("../views/lvmdp4.vue");
const DailyReport = () => import("../views/dailyReport.vue");

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "landing", component: Landing },
    {
      path: "/app",
      component: DashboardLayout,
      children: [
        { path: "lvmdp1", name: "lvmdp1", component: Lvmdp1 },
        { path: "lvmdp2", name: "lvmdp2", component: Lvmdp2 },
        { path: "lvmdp3", name: "lvmdp3", component: Lvmdp3 },
        { path: "lvmdp4", name: "lvmdp4", component: Lvmdp4 },
        { path: "daily-report", name: "dailyReport", component: DailyReport },
      ],
    },
  ],
});
