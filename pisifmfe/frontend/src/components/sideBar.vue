<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute, RouterLink } from "vue-router";
import {
  Cog,
  Zap,
  Factory,
  Package,
  BriefcaseConveyorBelt,
  CircleSmall,
} from "lucide-vue-next";

const route = useRoute();

// State untuk setiap menu utama
const openMenus = ref<Record<string, boolean>>({
  utility: false,
  lvmdp: false,
  // Siap untuk menu tambahan:
  production: false,
  packing: false,
});

const showText = ref(true);

// Auto-buka dropdown ketika berada di route terkait
watchEffect(() => {
  const routeName = String(route.name || "");
  const routePath = String(route.path || "");

  // Buka Utility > Electrical jika di lvmdp* atau daily-report
  if (routeName.startsWith("lvmdp") || routePath.includes("daily-report")) {
    openMenus.value.utility = true;
    openMenus.value.lvmdp = true;
  }

  // Buka Production jika di route production
  if (
    routeName === "pc39" ||
    routeName === "pc14" ||
    routeName === "ts1000" ||
    routeName === "fcp" ||
    routeName === "tws56" ||
    routeName === "tws72" ||
    routeName === "copack" ||
    routeName === "ihp" ||
    routePath.includes("daily-report/production")
  ) {
    openMenus.value.production = true;
  }

  // Buka Packing jika di route packing
  if (
    routePath.includes("weigher") ||
    routePath.includes("bagmaker") ||
    routePath.includes("daily-report/weigher") ||
    routePath.includes("daily-report/bagmaker")
  ) {
    openMenus.value.packing = true;
  }
});

// Menu struktur (nested, mudah di-extend)
const mainMenus = [
  {
    id: "utility",
    name: "Utility",
    icon: Cog,
    children: [
      {
        id: "lvmdp",
        name: "Electrical",
        icon: Zap,
        children: [
          { id: "lvmdp1", name: "LVMDP 1", routeName: "lvmdp1" },
          { id: "lvmdp2", name: "LVMDP 2", routeName: "lvmdp2" },
          { id: "lvmdp3", name: "LVMDP 3", routeName: "lvmdp3" },
          { id: "lvmdp4", name: "LVMDP 4", routeName: "lvmdp4" },
        ],
      },
    ],
  },
  {
    id: "production",
    name: "Production",
    icon: Factory,
    children: [
      { id: "pc39", name: "PC39", routeName: "pc39", icon: CircleSmall },
      { id: "pc14", name: "PC14", routeName: "pc14", icon: CircleSmall },
      { id: "ts1000", name: "TS1000", routeName: "ts1000", icon: CircleSmall },
      { id: "fcp", name: "FCP", routeName: "fcp", icon: CircleSmall },
      { id: "tws56", name: "TWS56", routeName: "tws56", icon: CircleSmall },
      { id: "tws72", name: "TWS72", routeName: "tws72", icon: CircleSmall },
      { id: "copack", name: "COPACK", routeName: "copack", icon: CircleSmall },
      { id: "ihp", name: "IHP", routeName: "ihp", icon: CircleSmall },
    ],
  },
  {
    id: "packing",
    name: "Packing",
    icon: Package,
    children: [
      {
        id: "packLineA",
        name: "Line A",
        icon: BriefcaseConveyorBelt,
        children: [
          {
            id: "weigherA",
            name: "Weigher",
            routeName: "weigherA",
            icon: CircleSmall,
          },
          {
            id: "bagmakerA",
            name: "BagMaker",
            routeName: "bagmakerA",
            icon: CircleSmall,
          },
        ],
      },
      {
        id: "packLineB",
        name: "Line B",
        icon: BriefcaseConveyorBelt,
        children: [
          {
            id: "weigherB",
            name: "Weigher",
            routeName: "weigherB",
            icon: CircleSmall,
          },
          {
            id: "bagmakerB",
            name: "BagMaker",
            routeName: "bagmakerB",
            icon: CircleSmall,
          },
        ],
      },
      {
        id: "packLineC",
        name: "Line C",
        icon: BriefcaseConveyorBelt,
        children: [
          {
            id: "weigherC",
            name: "Weigher",
            routeName: "weigherC",
            icon: CircleSmall,
          },
          {
            id: "bagmakerC",
            name: "BagMaker",
            routeName: "bagmakerC",
            icon: CircleSmall,
          },
        ],
      },
      {
        id: "packLineD",
        name: "Line D",
        icon: BriefcaseConveyorBelt,
        children: [
          {
            id: "weigherD",
            name: "Weigher",
            routeName: "weigherD",
            icon: CircleSmall,
          },
          {
            id: "bagmakerD",
            name: "BagMaker",
            routeName: "bagmakerD",
            icon: CircleSmall,
          },
        ],
      },
      {
        id: "packLineE",
        name: "Line E",
        icon: BriefcaseConveyorBelt,
        children: [
          {
            id: "weigherE",
            name: "Weigher",
            routeName: "weigherE",
            icon: CircleSmall,
          },
          {
            id: "bagmakerE",
            name: "BagMaker",
            routeName: "bagmakerE",
            icon: CircleSmall,
          },
        ],
      },
      // {
      //   id: "packLineF",
      //   name: "Line F",
      //   icon: BriefcaseConveyorBelt,
      //   children: [
      //     {
      //       id: "weigherF",
      //       name: "Weigher",
      //       routeName: "weigherF",
      //       icon: CircleSmall,
      //     },
      //     {
      //       id: "bagmakerF",
      //       name: "BagMaker",
      //       routeName: "bagmakerF",
      //       icon: CircleSmall,
      //     },
      //   ],
      // },
      {
        id: "packLineG",
        name: "Line G",
        icon: BriefcaseConveyorBelt,
        children: [
          {
            id: "weigherG",
            name: "Weigher",
            routeName: "weigherG",
            icon: CircleSmall,
          },
          {
            id: "bagmakerG",
            name: "BagMaker",
            routeName: "bagmakerG",
            icon: CircleSmall,
          },
        ],
      },
      {
        id: "packLineH",
        name: "Line H",
        icon: BriefcaseConveyorBelt,
        children: [
          {
            id: "weigherH",
            name: "Weigher",
            routeName: "weigherH",
            icon: CircleSmall,
          },
          {
            id: "bagmakerH",
            name: "BagMaker",
            routeName: "bagmakerH",
            icon: CircleSmall,
          },
        ],
      },
      {
        id: "packLineI",
        name: "Line I",
        icon: BriefcaseConveyorBelt,
        children: [
          {
            id: "weigherI",
            name: "Weigher",
            routeName: "weigherI",
            icon: CircleSmall,
          },
          {
            id: "bagmakerI",
            name: "BagMaker",
            routeName: "bagmakerI",
            icon: CircleSmall,
          },
        ],
      },
    ],
  },
];

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
      routeName === "ts1000" ||
      routeName === "fcp" ||
      routeName === "tws56" ||
      routeName === "tws72" ||
      routeName === "copack" ||
      routeName === "ihp")
  ) {
    // Extract production type from path
    const pathMatch = currentRoutePath.match(/production\/([^/?]+)/);
    if (pathMatch) {
      const prodType = pathMatch[1];
      return routeName === prodType;
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
              <!-- Jika submenu punya children lagi (nested level 2) -->
              <button
                v-if="(subMenu as any).children"
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
                v-else-if="(subMenu as any).routeName"
                :to="{ name: (subMenu as any).routeName }"
                class="submenu-item level-2"
                active-class="active"
              >
                <div class="h-2.5 w-2.5 rounded-full bg-slate-600" />
                <span>{{ subMenu.name }}</span>
              </RouterLink>

              <!-- Submenu Level 2 (nested children) -->
              <transition name="fade">
                <div
                  v-show="(subMenu as any).children && isMenuOpen(subMenu.id)"
                  class="submenu level-2"
                >
                  <RouterLink
                    v-for="childMenu in (subMenu as any).children"
                    :key="childMenu.id"
                    :to="{ name: childMenu.routeName }"
                    class="submenu-item level-3"
                    :class="{ active: isItemActive(childMenu.routeName) }"
                  >
                    <div class="h-2.5 w-2.5 rounded-full bg-slate-600" />
                    <span>{{ childMenu.name }}</span>
                  </RouterLink>
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
