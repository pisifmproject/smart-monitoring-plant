<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import {
  Globe2,
  Building2,
  LayoutDashboard,
  Zap,
  Factory,
  Settings,
} from "lucide-vue-next";
import { useAuth } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const { currentUser } = useAuth();

// Detect context: Are we in global dashboard or plant dashboard?
const isInPlantContext = computed(() => {
  return route.path.includes("/plant/");
});

const currentPlantId = computed(() => {
  return route.params.plantId as string;
});

const plantNames: Record<string, string> = {
  CIKOKOL: "Plant Cikokol",
  SEMARANG: "Plant Semarang",
  CIKUPA: "Plant Cikupa",
  AGRO: "Plant Agro",
};

// Get user accessible plants
const accessiblePlants = computed(() => {
  if (!currentUser.value) return [];
  if (currentUser.value.role === "ADMINISTRATOR") {
    return ["CIKOKOL", "SEMARANG", "CIKUPA", "AGRO"];
  }
  return currentUser.value.plantAccess || [];
});

// Global Dashboard menu
const globalMenuItems = computed(() => [
  {
    id: "global",
    name: "Global Overview",
    icon: Globe2,
    routeName: "global",
    children: null,
  },
  ...accessiblePlants.value.map((plantId) => ({
    id: plantId.toLowerCase(),
    name: plantNames[plantId] || plantId,
    icon: Building2,
    route: `/app/plant/${plantId}`,
    children: null,
  })),
]);

// Plant Dashboard menu with Energy & Utilities dropdown
const plantMenuItems = computed(() => {
  return [
    {
      id: "plantDashboard",
      name: "Plant Dashboard",
      icon: LayoutDashboard,
      route: `/app/plant/${currentPlantId.value}`,
    },
    {
      id: "energyUtilities",
      name: "Energy & Utilities",
      icon: Zap,
      route: `/app/plant/${currentPlantId.value}/utilities`,
      children: [
        {
          id: "electrical",
          name: "Electrical",
          route: `/app/plant/${currentPlantId.value}/electrical/panels`,
        },
      ],
    },
    {
      id: "productionLines",
      name: "Production Lines",
      icon: Factory,
      route: `/app/plant/${currentPlantId.value}/production`,
    },
  ];
});

const expandedMenus = ref<Record<string, boolean>>({});

const toggleMenu = (menuId: string) => {
  expandedMenus.value[menuId] = !expandedMenus.value[menuId];
};

const isMenuExpanded = (menuId: string) => {
  return expandedMenus.value[menuId] ?? false;
};

const isMenuItemActive = (item: any) => {
  if (item.routeName && route.name === item.routeName) return true;
  if (item.route && route.path === item.route) return true;
  return false;
};
</script>

<template>
  <aside
    class="w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 flex flex-col fixed top-0 left-0 z-50 overflow-y-auto"
  >
    <!-- Logo/Title -->
    <div class="p-6 border-b border-slate-800">
      <h2 class="text-xl font-bold text-blue-500 tracking-wide">
        PT INDOFOOD FORTUNA MAKMUR
      </h2>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2">
      <!-- Global Dashboard Menu -->
      <div v-if="!isInPlantContext" class="space-y-1">
        <div
          class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2"
        >
          DASHBOARDS
        </div>
        <template v-for="item in globalMenuItems" :key="item.id">
          <router-link
            v-if="item.routeName"
            :to="{ name: item.routeName }"
            :class="[
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              isMenuItemActive(item)
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
            ]"
          >
            <component :is="item.icon" :size="18" />
            <span>{{ item.name }}</span>
          </router-link>
          <router-link
            v-else-if="item.route"
            :to="item.route"
            :class="[
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              route.path === item.route
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
            ]"
          >
            <component :is="item.icon" :size="18" />
            <span>{{ item.name }}</span>
          </router-link>
        </template>

        <div
          class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mt-6"
        >
          PRODUCTION PLANTS
        </div>
        <template v-for="plantId in accessiblePlants" :key="plantId">
          <router-link
            :to="`/app/plant/${plantId}`"
            :class="[
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              currentPlantId === plantId && isInPlantContext
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
            ]"
          >
            <Building2 :size="18" />
            <span>{{ plantNames[plantId] || plantId }}</span>
          </router-link>
        </template>
      </div>

      <!-- Plant Dashboard Menu -->
      <div v-else class="space-y-1">
        <div class="mb-4">
          <router-link
            to="/app/global"
            class="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
          >
            <span>←</span>
            <span>Back to Global Overview</span>
          </router-link>
        </div>

        <template v-for="item in plantMenuItems" :key="item.id">
          <!-- Menu with children (expandable) -->
          <div v-if="item.children">
            <router-link
              :to="item.route"
              @click.prevent="
                $router.push(item.route);
                toggleMenu(item.id);
              "
              :class="[
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                route.path === item.route || route.path.startsWith(item.route)
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              ]"
            >
              <div class="flex items-center gap-3">
                <component :is="item.icon" :size="18" />
                <span>{{ item.name }}</span>
              </div>
              <svg
                :class="[
                  'w-4 h-4 transition-transform',
                  isMenuExpanded(item.id) ? 'rotate-90' : '',
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                @click.prevent.stop="toggleMenu(item.id)"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </router-link>
            <!-- Submenu -->
            <div v-show="isMenuExpanded(item.id)" class="ml-4 mt-1 space-y-1">
              <router-link
                v-for="child in item.children"
                :key="child.id"
                :to="child.route"
                :class="[
                  'block px-3 py-2 rounded-lg text-sm transition-all',
                  route.path === child.route
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                ]"
              >
                {{ child.name }}
              </router-link>
            </div>
          </div>
          <!-- Simple menu item (no children) -->
          <router-link
            v-else
            :to="item.route"
            :class="[
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              route.path === item.route || route.path.startsWith(item.route)
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
            ]"
          >
            <component :is="item.icon" :size="18" />
            <span>{{ item.name }}</span>
          </router-link>
        </template>

        <div
          class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mt-6"
        >
          ADMINISTRATION
        </div>
        <router-link
          to="/app/settings"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
            route.name === 'settings'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white',
          ]"
        >
          <Settings :size="18" />
          <span>System Settings</span>
        </router-link>
      </div>
    </nav>

    <!-- User Profile Footer -->
    <div class="p-4 border-t border-slate-800" v-if="currentUser">
      <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-white"
          >
            {{ currentUser.name.substring(0, 2).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-white truncate">
              {{ currentUser.name }}
            </p>
            <p class="text-xs text-blue-400 font-medium truncate">
              {{ currentUser.role }}
            </p>
          </div>
        </div>
        <button
          @click="router.push('/login')"
          class="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all border border-slate-700 hover:border-rose-500/30"
        >
          SIGN OUT
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Custom scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
