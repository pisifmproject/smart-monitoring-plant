<script setup lang="ts">
import { ref, watchEffect, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { Cog, Zap, Factory, CircleSmall } from "lucide-vue-next";
import { useAuth } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const { canAccessDailyReport } = useAuth();

// State untuk setiap menu utama
const openMenus = ref<Record<string, boolean>>({
  utility: false,
  lvmdp: false,
  production: false,
});

const showText = ref(true);

// Helper to check if route exists
function routeExists(routeName: string | undefined | null): boolean {
  if (!routeName || typeof routeName !== "string") return false;
  try {
    return router.hasRoute(routeName);
  } catch (error) {
    return false;
  }
}

// Auto-buka dropdown ketika berada di route terkait
watchEffect(() => {
  const routeName = String(route.name || "");
  const routePath = String(route.path || "");

  // Buka Utility > Electrical jika di lvmdp* atau daily-report
  if (
    routeName.startsWith("lvmdp") ||
    routePath.includes("daily-report") ||
    routeName === "summary"
  ) {
    openMenus.value.utility = true;
    openMenus.value.lvmdp = true;
  }

  // Buka Production jika di route production, weigher, bagmaker, atau utility consumption
  if (
    routeName === "pc39" ||
    routeName === "pc14" ||
    routeName === "ts1000" ||
    routeName === "fcp" ||
    routeName === "tws56" ||
    routeName === "tws72" ||
    routeName === "copack" ||
    routeName === "ihp" ||
    routeName === "cassavaInhouse" ||
    routeName === "tortila" ||
    routeName === "packingPouch" ||
    routeName === "vacuumFryer" ||
    routeName.startsWith("utility") ||
    routePath.includes("weigher") ||
    routePath.includes("bagmaker") ||
    routePath.includes("daily-report/production") ||
    routePath.includes("/utility/")
  ) {
    openMenus.value.production = true;

    // Auto expand submenu mesin yang aktif berdasarkan route
    if (
      routePath.includes("weigherPC39") ||
      routePath.includes("weigher-pc39") ||
      routePath.includes("bagmakerPC39") ||
      routePath.includes("bagmaker-pc39") ||
      routeName === "utilityPC39"
    ) {
      openMenus.value.pc39 = true;
    }
    if (
      routePath.includes("weigherPC14") ||
      routePath.includes("weigher-pc14") ||
      routePath.includes("bagmakerPC14") ||
      routePath.includes("bagmaker-pc14") ||
      routeName === "utilityPC14"
    ) {
      openMenus.value.pc14 = true;
    }
    if (
      routePath.includes("weigherCassavaInhouse") ||
      routePath.includes("weigher-cassava-inhouse") ||
      routePath.includes("bagmakerCassavaInhouse") ||
      routePath.includes("bagmaker-cassava-inhouse") ||
      routeName === "utilityTS1000"
    ) {
      openMenus.value.ts1000 = true;
    }
    if (
      routePath.includes("weigherFCP") ||
      routePath.includes("weigher-fcp") ||
      routePath.includes("bagmakerFCP") ||
      routePath.includes("bagmaker-fcp") ||
      routeName === "utilityFCP"
    ) {
      openMenus.value.fcp = true;
    }
    if (
      routePath.includes("weigherTWS56") ||
      routePath.includes("weigher-tws56") ||
      routePath.includes("bagmakerTWS56") ||
      routePath.includes("bagmaker-tws56") ||
      routeName === "utilityTWS56"
    ) {
      openMenus.value.tws56 = true;
    }
    if (
      routePath.includes("weigherTWS72") ||
      routePath.includes("weigher-tws72") ||
      routePath.includes("bagmakerTWS72") ||
      routePath.includes("bagmaker-tws72") ||
      routeName === "utilityTWS72"
    ) {
      openMenus.value.tws72 = true;
    }
    if (
      routePath.includes("weigherCassavaCopack") ||
      routePath.includes("weigher-cassava-copack") ||
      routePath.includes("bagmakerCassavaCopack") ||
      routePath.includes("bagmaker-cassava-copack") ||
      routeName === "utilityCassavaCopack"
    ) {
      openMenus.value.cassavaCopack = true;
    }
    if (
      routePath.includes("weigherPackingPouch") ||
      routePath.includes("weigher-packing-pouch") ||
      routePath.includes("bagmakerPackingPouch") ||
      routePath.includes("bagmaker-packing-pouch") ||
      routeName === "utilityIHP"
    ) {
      openMenus.value.ihp = true;
    }
    // Add auto-expand for new machines
    if (
      routePath.includes("weigherCassavaInhouse") ||
      routePath.includes("weigher-cassava-inhouse") ||
      routePath.includes("bagmakerCassavaInhouse") ||
      routePath.includes("bagmaker-cassava-inhouse") ||
      routeName === "utilityCassavaInhouse" ||
      routeName === "cassavaInhouse"
    ) {
      openMenus.value.cassavaInhouse = true;
    }
    if (
      routePath.includes("weigherTortila") ||
      routePath.includes("weigher-tortila") ||
      routePath.includes("bagmakerTortila") ||
      routePath.includes("bagmaker-tortila") ||
      routeName === "utilityTortila" ||
      routeName === "tortila"
    ) {
      openMenus.value.tortila = true;
    }
    if (
      routePath.includes("weigherPackingPouch") ||
      routePath.includes("weigher-packing-pouch") ||
      routePath.includes("bagmakerPackingPouch") ||
      routePath.includes("bagmaker-packing-pouch") ||
      routeName === "utilityPackingPouch" ||
      routeName === "packingPouch"
    ) {
      openMenus.value.packingPouch = true;
    }
    if (routeName === "utilityVacuumFryer" || routeName === "vacuumFryer") {
      openMenus.value.vacuumFryer = true;
    }
  }
});

// Menu struktur (nested, mudah di-extend)
// Filter submenu based on user role
const getProductionChildren = () => {
  const isGuest = !canAccessDailyReport();

  const machines = [
    {
      id: "pc14",
      name: "PC 14",
      icon: CircleSmall,
      dashboardRoute: "pc14",
      weigherRoute: "weigherPC14",
      bagmakerRoute: "bagmakerPC14",
      utilityRoute: "utilityPC14",
    },
    {
      id: "pc39",
      name: "PC 39",
      icon: CircleSmall,
      dashboardRoute: "pc39",
      weigherRoute: "weigherPC39",
      bagmakerRoute: "bagmakerPC39",
      utilityRoute: "utilityPC39",
    },
    {
      id: "cassavaInhouse",
      name: "Cassava Inhouse",
      icon: CircleSmall,
      dashboardRoute: "cassavaInhouse",
      weigherRoute: "weigherCassavaInhouse",
      bagmakerRoute: "bagmakerCassavaInhouse",
      utilityRoute: "utilityCassavaInhouse",
    },
    {
      id: "cassavaCopack",
      name: "Cassava Copack",
      icon: CircleSmall,
      dashboardRoute: "copack",
      weigherRoute: "weigherCassavaCopack",
      bagmakerRoute: "bagmakerCassavaCopack",
      utilityRoute: "utilityCassavaCopack",
    },
    {
      id: "tortila",
      name: "Tortila",
      icon: CircleSmall,
      dashboardRoute: "tortila",
      weigherRoute: "weigherTortila",
      bagmakerRoute: "bagmakerTortila",
      utilityRoute: "utilityTortila",
    },
    {
      id: "fcp",
      name: "FCP",
      icon: CircleSmall,
      dashboardRoute: "fcp",
      weigherRoute: "weigherFCP",
      bagmakerRoute: "bagmakerFCP",
      utilityRoute: "utilityFCP",
    },
    {
      id: "tws56",
      name: "TWS 5.6",
      icon: CircleSmall,
      dashboardRoute: "tws56",
      weigherRoute: "weigherTWS56",
      bagmakerRoute: "bagmakerTWS56",
      utilityRoute: "utilityTWS56",
    },
    {
      id: "tws72",
      name: "TWS 7.2",
      icon: CircleSmall,
      dashboardRoute: "tws72",
      weigherRoute: "weigherTWS72",
      bagmakerRoute: "bagmakerTWS72",
      utilityRoute: "utilityTWS72",
    },
    {
      id: "packingPouch",
      name: "Packing Pouch (Promina Puff)",
      icon: CircleSmall,
      dashboardRoute: "packingPouch",
      weigherRoute: "weigherPackingPouch",
      bagmakerRoute: "bagmakerPackingPouch",
      utilityRoute: "utilityPackingPouch",
    },
    {
      id: "vacuumFryer",
      name: "Vacuum Fryer 1",
      icon: CircleSmall,
      dashboardRoute: "vacuumFryer",
      weigherRoute: null,
      bagmakerRoute: null,
      utilityRoute: "utilityVacuumFryer",
    },
  ];

  return machines.map((machine) => {
    const children = [
      {
        id: `${machine.id}Dashboard`,
        name: "Dashboard",
        routeName: machine.dashboardRoute,
      },
    ];

    // Only add Utility Consumption, Weigher and BagMaker for User role
    if (!isGuest) {
      children.push({
        id: `${machine.id}Utility`,
        name: "Utility Consumption",
        routeName: machine.utilityRoute,
      });

      if (machine.weigherRoute) {
        children.push({
          id: machine.weigherRoute,
          name: "Weigher",
          routeName: machine.weigherRoute,
        });
      }
      if (machine.bagmakerRoute) {
        children.push({
          id: machine.bagmakerRoute,
          name: "BagMaker",
          routeName: machine.bagmakerRoute,
        });
      }
    }

    return {
      id: machine.id,
      name: machine.name,
      icon: machine.icon,
      children,
    };
  });
};

const mainMenus = computed(() => [
  {
    id: "utility",
    name: "Utility",
    icon: Cog,
    children: [
      {
        id: "lvmdp",
        name: "Electrical",
        icon: Zap,
        summaryRoute: "summary", // Add summary route
        children: [
          { id: "lvmdp1", name: "Panel 1", routeName: "lvmdp1" },
          { id: "lvmdp2", name: "Panel 2", routeName: "lvmdp2" },
          { id: "lvmdp3", name: "Panel 3", routeName: "lvmdp3" },
          { id: "lvmdp4", name: "Panel 4", routeName: "lvmdp4" },
        ],
      },
    ],
  },
  {
    id: "production",
    name: "Production",
    icon: Factory,
    children: getProductionChildren(),
  },
]);

function toggleMenu(menuId: string) {
  openMenus.value[menuId] = !openMenus.value[menuId];
}

function isMenuOpen(menuId: string): boolean {
  return openMenus.value[menuId] ?? false;
}

// Check if a menu item should be marked as active
function isItemActive(routeName: string): boolean {
  const currentRouteName = String(route.name || "");
  const currentRoutePath = String(route.path || "");

  // Direct match
  if (currentRouteName === routeName) {
    return true;
  }

  // Special case: LVMDP items should be active when in daily-report
  if (
    currentRoutePath.includes("daily-report") &&
    (routeName === "lvmdp1" ||
      routeName === "lvmdp2" ||
      routeName === "lvmdp3" ||
      routeName === "lvmdp4")
  ) {
    // Check panel parameter from query
    const panelId = route.query.panel;
    if (panelId) {
      return routeName === `lvmdp${panelId}`;
    }
  }

  // Special case: Production items should be active when in production daily-report
  if (
    currentRoutePath.includes("daily-report/production") &&
    (routeName === "pc39" ||
      routeName === "pc14" ||
      routeName === "fcp" ||
      routeName === "tws56" ||
      routeName === "tws72" ||
      routeName === "copack" ||
      routeName === "cassavaInhouse" ||
      routeName === "tortila" ||
      routeName === "packingPouch" ||
      routeName === "vacuumFryer")
  ) {
    // Extract production type from path
    const pathMatch = currentRoutePath.match(/production\/([^/?]+)/);
    if (pathMatch) {
      const prodType = pathMatch[1];
      // Convert kebab-case to camelCase for comparison
      const routeNameKebab = routeName
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "");
      return routeNameKebab === prodType;
    }
  }

  // Special case: Packing items (weigher/bagmaker) should be active in daily-report
  if (currentRoutePath.includes("daily-report/weigher")) {
    const lineMatch = currentRoutePath.match(/line-([a-i])/i);
    if (lineMatch) {
      const line = lineMatch[1].toUpperCase();
      return routeName === `weigher${line}`;
    }
  }

  if (currentRoutePath.includes("daily-report/bagmaker")) {
    const lineMatch = currentRoutePath.match(/line-([a-i])/i);
    if (lineMatch) {
      const line = lineMatch[1].toUpperCase();
      return routeName === `bagmaker${line}`;
    }
  }

  return false;
}
</script>

<template>
  <aside class="sidebar">
    <h2 class="sidebar-title">
      <!-- <span class="title-icon">⚡</span> -->
      <span>PISIFM</span>
    </h2>

    <nav class="menu">
      <!-- Menu utama dengan nested structure -->
      <template v-for="mainMenu in mainMenus" :key="mainMenu.id">
        <!-- Level 1: Main Menu (dengan children) -->
        <button
          v-if="mainMenu.children"
          class="group-trigger"
          @click="toggleMenu(mainMenu.id)"
          :aria-expanded="isMenuOpen(mainMenu.id) ? 'true' : 'false'"
        >
          <span class="flex items-center gap-2">
            <component
              v-if="mainMenu.icon"
              :is="mainMenu.icon"
              class="w-4 h-4"
            />
            <span>{{ mainMenu.name }}</span>
          </span>
          <span class="chev" :class="{ rot: isMenuOpen(mainMenu.id) }">▾</span>
        </button>

        <!-- Submenu Level 1 -->
        <transition name="fade">
          <div v-show="isMenuOpen(mainMenu.id)" class="submenu level-1">
            <!-- Level 2: Submenu items -->
            <template v-for="subMenu in mainMenu.children" :key="subMenu.id">
              <!-- Jika submenu punya children lagi (nested level 2) dengan summaryRoute -->
              <div
                v-if="(subMenu as any).children && (subMenu as any).summaryRoute"
              >
                <!-- Summary Route - ditampilkan saat klik parent -->
                <RouterLink
                  :to="{ name: (subMenu as any).summaryRoute }"
                  class="group-trigger level-2 summary-link"
                  active-class="active-summary"
                  @click="toggleMenu(subMenu.id)"
                >
                  <span class="flex items-center gap-2">
                    <component
                      v-if="subMenu.icon"
                      :is="subMenu.icon"
                      class="w-4 h-4"
                    />
                    <span>{{ subMenu.name }}</span>
                  </span>
                  <span class="chev" :class="{ rot: isMenuOpen(subMenu.id) }"
                    >▾</span
                  >
                </RouterLink>

                <!-- Toggle untuk show/hide children -->
                <!-- Children hanya muncul ketika arrow diklik -->
                <transition name="fade">
                  <div v-show="isMenuOpen(subMenu.id)" class="submenu level-2">
                    <template
                      v-for="childMenu in ((subMenu as any).children || [])"
                      :key="childMenu?.id || Math.random()"
                    >
                      <RouterLink
                        v-if="
                          childMenu &&
                          childMenu.routeName &&
                          routeExists(childMenu.routeName)
                        "
                        :to="{ name: childMenu.routeName }"
                        class="submenu-item level-3"
                        :class="{ active: isItemActive(childMenu.routeName) }"
                      >
                        <div class="h-2.5 w-2.5 rounded-full bg-slate-600" />
                        <span>{{ childMenu.name }}</span>
                      </RouterLink>
                    </template>
                  </div>
                </transition>
              </div>

              <!-- Jika submenu punya children lagi (nested level 2) tanpa summaryRoute -->
              <button
                v-else-if="(subMenu as any).children"
                class="group-trigger level-2"
                @click="toggleMenu(subMenu.id)"
                :aria-expanded="isMenuOpen(subMenu.id) ? 'true' : 'false'"
              >
                <span class="flex items-center gap-2">
                  <component
                    v-if="subMenu.icon"
                    :is="subMenu.icon"
                    class="w-4 h-4"
                  />
                  <span>{{ subMenu.name }}</span>
                </span>
                <span class="chev" :class="{ rot: isMenuOpen(subMenu.id) }"
                  >▾</span
                >
              </button>

              <!-- Jika submenu adalah route (leaf node) -->
              <RouterLink
                v-else-if="(subMenu as any).routeName && routeExists((subMenu as any).routeName)"
                :to="{ name: (subMenu as any).routeName }"
                class="submenu-item level-2"
                active-class="active"
              >
                <div class="h-2.5 w-2.5 rounded-full bg-slate-600" />
                <span>{{ subMenu.name }}</span>
              </RouterLink>

              <!-- Submenu Level 2 (nested children) untuk yang tanpa summaryRoute -->
              <transition name="fade">
                <div
                  v-show="(subMenu as any).children && !((subMenu as any).summaryRoute) && isMenuOpen(subMenu.id)"
                  class="submenu level-2"
                >
                  <template
                    v-for="childMenu in ((subMenu as any).children || [])"
                    :key="childMenu?.id || Math.random()"
                  >
                    <RouterLink
                      v-if="
                        childMenu &&
                        childMenu.routeName &&
                        routeExists(childMenu.routeName)
                      "
                      :to="{ name: childMenu.routeName }"
                      class="submenu-item level-3"
                      :class="{ active: isItemActive(childMenu.routeName) }"
                    >
                      <div class="h-2.5 w-2.5 rounded-full bg-slate-600" />
                      <span>{{ childMenu.name }}</span>
                    </RouterLink>
                  </template>
                </div>
              </transition>
            </template>
          </div>
        </transition>
      </template>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  background: linear-gradient(135deg, #1a1f2e 0%, #111827 100%);
  width: 240px;
  height: 100vh;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #e2e8f0;
  border-right: 1px solid rgba(226, 232, 240, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0ea5e9;
  text-align: center;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.title-icon {
  font-size: 1.5rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* tombol group - Level 1 (Utility, Production, Packing) */
.group-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  text-align: left;
  transition: all 0.2s ease;
  font-weight: 600;
  width: 100%;
}

.group-trigger:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.12);
}

/* Level 2: Submenu trigger (LVMDP, Settings, etc inside Utility) */
.group-trigger.level-2 {
  padding: 8px 12px;
  font-size: 0.95rem;
  font-weight: 500;
  border: none;
  background: rgba(255, 255, 255, 0.03);
  margin-left: 12px;
}

.group-trigger.level-2:hover {
  background-color: rgba(14, 165, 233, 0.1);
}

/* Summary link styling */
.summary-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: #cbd5e1;
  transition: all 0.2s ease;
  cursor: pointer;
}

.summary-link:hover {
  background-color: rgba(14, 165, 233, 0.15);
  color: #fff;
}

.summary-link.active-summary {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
}

.chev {
  transition: transform 0.2s ease;
  color: #64748b;
  font-size: 0.8rem;
}

.chev.rot {
  transform: rotate(180deg);
}

/* submenu - container */
.submenu {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 12px;
  margin-top: 6px;
}

.submenu.level-1 {
  border-left: 2px solid rgba(14, 165, 233, 0.3);
  padding-left: 16px;
  margin-left: 0;
}

.submenu.level-2 {
  border-left: 2px solid rgba(14, 165, 233, 0.2);
  padding-left: 16px;
}

/* submenu item - leaf node (actual link) */
.submenu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
}

/* Level 2 submenu items (direct children of Utility) */
.submenu-item.level-2 {
  padding: 8px 12px;
}

/* Level 3 submenu items (LVMDP 1-4, under LVMDP) */
.submenu-item.level-3 {
  padding: 7px 12px;
  font-size: 0.95rem;
  margin-left: 8px;
}

.submenu-item:hover {
  background-color: rgba(14, 165, 233, 0.15);
  color: #fff;
}

.submenu-item.active {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
  font-weight: 500;
}

.submenu-item :deep(.h-2\.5) {
  transition: all 0.2s ease;
}

.submenu-item.active :deep(.h-2\.5) {
  background-color: #fff !important;
}

/* animasi muncul */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 80vw;
    max-width: 300px;
    height: 100vh;
    min-height: 100vh;
    padding: 20px 12px;
    z-index: 1000;
    box-shadow: 2px 0 16px rgba(0, 0, 0, 0.3);
  }

  .sidebar-title {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }

  .menu {
    gap: 4px;
    overflow-y: auto;
    max-height: calc(100vh - 100px);
  }

  .group-trigger {
    font-size: 0.95rem;
    padding: 8px 10px;
  }

  .group-trigger.level-2 {
    font-size: 0.9rem;
    padding: 7px 8px;
  }

  .submenu.level-1,
  .submenu.level-2 {
    padding-left: 10px;
  }

  .submenu-item.level-2,
  .submenu-item.level-3 {
    padding: 6px 8px;
    font-size: 0.9rem;
  }
}
</style>
