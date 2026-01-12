<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PLANTS, type PlantId } from "@/config/app.config";
import { useAuth } from "@/stores/auth";
import { useVisibility } from "@/composables/useVisibility";
import {
  LayoutDashboard,
  Factory,
  Zap,
  Droplets,
  Wind,
  Flame,
  CornerUpLeft,
  ChevronDown,
  ChevronRight,
  Activity,
  ChevronsLeft,
  Settings,
  Users,
  Eye
} from "lucide-vue-next";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['toggle']);

const route = useRoute();
const router = useRouter();
const { canManageUsers, canAccessPlant, hasRole } = useAuth();

// Derived state
const currentPlantId = computed(
  () => route.params.plantId as PlantId | undefined
);
const isPlantView = computed(() => !!currentPlantId.value);
const currentPlant = computed(() =>
  currentPlantId.value ? PLANTS[currentPlantId.value] : null
);

// Visibility composable
const { isVisible, isReady, visibilityVersion } = useVisibility();

// Sidebar grouping state
const energyExpanded = ref(true);
const electricityExpanded = ref(false);
const productionExpanded = ref(false);

// Reset production dropdown when switching plants
watch(currentPlantId, () => {
    productionExpanded.value = false;
});

// Filter plants based on user access
const accessiblePlants = computed(() => {
  return Object.values(PLANTS).filter(plant => canAccessPlant(plant.id));
});

// Filter machines based on visibility settings
const visibleMachines = computed(() => {
  // Access visibilityVersion to create reactive dependency
  const _ = visibilityVersion.value;
  if (!currentPlant.value?.machines) return [];
  return currentPlant.value.machines.filter(machine => {
    const key = `SHOW_MACHINE_${machine.id}`;
    return isVisible(key, { plantId: currentPlantId.value });
  });
});

const isAdminRoute = computed(() => route.path.startsWith('/admin'));

function navigateTo(path: string) {
  router.push(path);
}

function toggleEnergy() {
  energyExpanded.value = !energyExpanded.value;
}

function toggleElectricity() {
  electricityExpanded.value = !electricityExpanded.value;
}

function toggleProduction() {
  productionExpanded.value = !productionExpanded.value;
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-closed': !isOpen }">
    <div class="sidebar-header">
      <div class="header-top-row">
          <div class="logo">
            <Activity class="logo-icon" />
            <span class="logo-text">PT Indofood Fortuna Makmur</span>
          </div>
          <button class="collapse-btn" @click="emit('toggle')" title="Collapse Sidebar">
              <ChevronsLeft class="w-5 h-5" />
          </button>
      </div>
      
      <div v-if="isAdminRoute" class="plant-badge admin">System Admin</div>
      <div v-else-if="isPlantView && currentPlant" class="plant-badge">
        {{ currentPlant.name }}
      </div>
      <div v-else class="plant-badge global">Corporate View</div>
    </div>

    <nav class="sidebar-nav">
      <!-- ADMIN VIEW NAVIGATION -->
      <template v-if="isAdminRoute">
        <div class="nav-section">
          <div class="nav-label">System Admin</div>
          <div 
            class="nav-item" 
            :class="{ active: route.name === 'VisibilityControl' }"
            @click="navigateTo('/admin/visibility')"
          >
            <Eye class="nav-icon" />
            <span>Visibility Control</span>
          </div>
          <div 
            class="nav-item" 
            :class="{ active: route.name === 'UserManagement' }"
            @click="navigateTo('/admin/users')"
          >
            <Users class="nav-icon" />
            <span>Users & Roles</span>
          </div>

        </div>

        <div class="nav-divider"></div>

        <div class="nav-item back-link" @click="navigateTo('/global')">
            <CornerUpLeft class="nav-icon" />
            <span>Back to App</span>
        </div>
      </template>

      <!-- GLOBAL VIEW NAVIGATION -->
      <template v-else-if="!isPlantView">
        <div class="nav-section">
          <div class="nav-label">Overview</div>
          <a class="nav-item active">
            <LayoutDashboard class="nav-icon" />
            <span>Global Dashboard</span>
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-label">Plants</div>
          <div
            v-for="plant in accessiblePlants"
            :key="plant.id"
            class="nav-item"
            @click="navigateTo(`/plant/${plant.id}`)"
          >
            <Factory class="nav-icon" />
            <span>{{ plant.name }}</span>
          </div>
          <div v-if="accessiblePlants.length === 0" class="nav-item disabled">
            <Factory class="nav-icon" />
            <span class="text-slate-500 italic">No plant access</span>
          </div>
        </div>
        
        <template v-if="canManageUsers">
           <div class="nav-divider"></div>
           <div 
            class="nav-item" 
            :class="{ active: route.path.startsWith('/admin') }"
            @click="navigateTo('/admin/visibility')"
           >
              <Settings class="nav-icon" />
              <span>System Settings</span>
           </div>
        </template>
      </template>

      <!-- PLANT VIEW NAVIGATION -->
      <template v-else>
        <div class="nav-item back-link" @click="navigateTo('/global')">
          <CornerUpLeft class="nav-icon" />
          <span>Back to Global</span>
        </div>

        <div class="nav-divider"></div>

        <div
          class="nav-item"
          :class="{ active: route.name === 'PlantDashboard' }"
          @click="navigateTo(`/plant/${currentPlantId}`)"
        >
          <LayoutDashboard class="nav-icon" />
          <span>Dashboard</span>
        </div>

        <!-- Energy & Utilities Group -->
        <div class="nav-group">
          <div 
            class="nav-item group-header" 
            :class="{ active: route.name === 'UtilitiesDashboard' }"
            @click="navigateTo(`/plant/${currentPlantId}/energy`); energyExpanded = true"
          >
            <Zap class="nav-icon" />
            <span>Energy & Utilities</span>
            <component
              :is="energyExpanded ? ChevronDown : ChevronRight"
              class="group-arrow"
              @click.stop="toggleEnergy"
            />
          </div>

          <div v-if="energyExpanded" class="group-content">
            <!-- Electricity with LVMDP submenu -->
            <div class="nav-group">
              <div
                class="nav-item sub-item group-header"
                :class="{
                  active:
                    route.path ===
                      `/plant/${currentPlantId}/energy/electricity` &&
                    !route.params.lvmdpId,
                }"
                @click="
                  navigateTo(`/plant/${currentPlantId}/energy/electricity`)
                "
              >
                <Zap class="nav-icon-small" />
                <span>Electricity</span>
                <component
                  :is="electricityExpanded ? ChevronDown : ChevronRight"
                  class="group-arrow-small"
                  @click.stop="toggleElectricity"
                />
              </div>

              <div v-if="electricityExpanded" class="sub-group-content">
                <div
                  v-for="i in 4"
                  :key="`lvmdp-${i}`"
                  class="nav-item leaf-item"
                  :class="{ active: route.params.lvmdpId === String(i) }"
                  @click="
                    navigateTo(
                      `/plant/${currentPlantId}/energy/electricity/lvmdp/${i}`
                    )
                  "
                >
                  <span>LVMDP {{ i }}</span>
                </div>
              </div>
            </div>

            <div
              class="nav-item sub-item"
              @click="navigateTo(`/plant/${currentPlantId}/energy/steam`)"
            >
              <Flame class="nav-icon-small" /> <span>Steam</span>
            </div>
            <div
              class="nav-item sub-item"
              @click="navigateTo(`/plant/${currentPlantId}/energy/water`)"
            >
              <Droplets class="nav-icon-small" /> <span>Water</span>
            </div>
            <div
              class="nav-item sub-item"
              @click="
                navigateTo(`/plant/${currentPlantId}/energy/compressed-air`)
              "
            >
              <Wind class="nav-icon-small" /> <span>Compressed Air</span>
            </div>
            <div
              class="nav-item sub-item"
              @click="navigateTo(`/plant/${currentPlantId}/energy/nitrogen`)"
            >
              <Wind class="nav-icon-small" /> <span>Nitrogen</span>
            </div>
            <div
              class="nav-item sub-item"
              @click="navigateTo(`/plant/${currentPlantId}/energy/gas`)"
            >
              <Flame class="nav-icon-small" /> <span>Gas</span>
            </div>
          </div>
        </div>

        <!-- Production Lines (expandable group with machines) -->
        <div class="nav-group">
          <div 
            class="nav-item group-header" 
            :class="{ active: route.name === 'ProductionDashboard' }"
            @click="navigateTo(`/plant/${currentPlantId}/production`); productionExpanded = true"
          >
            <Factory class="nav-icon" />
            <span>Production Lines</span>
            <component
              :is="productionExpanded ? ChevronDown : ChevronRight"
              class="group-arrow"
              @click.stop="toggleProduction"
            />
          </div>
          <div v-if="productionExpanded" class="group-content">
            <div
              v-for="machine in visibleMachines"
              :key="machine.id"
              class="nav-item sub-item"
              :class="{ active: route.params.machineId === machine.id }"
              @click="
                navigateTo(
                  `/plant/${currentPlantId}/production/machine/${machine.id}`
                )
              "
            >
              <span>{{ machine.name }}</span>
            </div>
            <div v-if="visibleMachines.length === 0" class="nav-item sub-item disabled">
              <span class="text-slate-500 italic text-sm">No machines visible</span>
            </div>
          </div>
        </div>
      </template>
      
      <!-- ADMINISTRATION -->

    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background-color: #0f172a;
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  color: #94a3b8;
  font-family: "Inter", sans-serif;
  overflow-y: auto;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #1e293b;
}

.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #38bdf8;
  flex: 1;
}

.logo-icon {
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
}

.logo-text {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: white;
}

.collapse-btn {
    background: transparent;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s;
    margin-top: -0.25rem;
}

.collapse-btn:hover {
    color: #e2e8f0;
    background: rgba(255,255,255,0.1);
}

.plant-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: #1e293b;
  color: #94a3b8;
  border: 1px solid #334155;
}

.plant-badge.global {
  background-color: #3b82f6;
  color: white;
  border-color: #2563eb;
}

.plant-badge.admin {
  background-color: #f59e0b;
  color: #fff;
  border-color: #d97706;
}

.sidebar-nav {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.nav-label {
  padding: 0 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  color: #475569;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  font-weight: 500;
}

.nav-item:hover {
  background-color: #1e293b;
  color: white;
}

.nav-item.active {
  background-color: #3b82f6;
  color: white;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.nav-icon-small {
  width: 1rem;
  height: 1rem;
}

.back-link {
  color: #64748b;
  margin-bottom: 1rem;
}

.nav-divider {
  height: 1px;
  background-color: #1e293b;
  margin: 0.5rem 0 1rem 0;
}

.group-header {
  justify-content: space-between;
}

.group-arrow {
  width: 1rem;
  height: 1rem;
  opacity: 0.5;
}

.group-arrow-small {
  width: 0.875rem;
  height: 0.875rem;
  opacity: 0.5;
  margin-left: auto;
}

.group-content {
  margin-left: 0.5rem;
  border-left: 1px solid #1e293b;
  padding-left: 0.5rem;
}

.sub-group-content {
  margin-left: 0.5rem;
  border-left: 1px solid #1e293b;
  padding-left: 0.5rem;
}

.sub-item {
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
}

.leaf-item {
  font-size: 0.8rem;
  padding: 0.4rem 0.75rem;
}

.sidebar-closed {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 999;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
  }

  .sidebar-closed {
    display: none !important;
  }
}
</style>
