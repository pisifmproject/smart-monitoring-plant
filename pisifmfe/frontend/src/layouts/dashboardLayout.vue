<script setup lang="ts">
import { ref, watchEffect, computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import SideBar from "@/components/sideBar.vue";

const route = useRoute();

// kontrol buka/tutup sidebar
const isSidebarOpen = ref(true);

// dropdown LVMDP
const openLvmdp = ref(true);

// auto-buka grup LVMDP kalau lagi di route lvmdp*
watchEffect(() => {
  const name = String(route.name || "");
  if (name.startsWith("lvmdp")) {
    openLvmdp.value = true;
  }
});

// daftar menu LVMDP
const lvmdpMenus = [
  { name: "LVMDP 1", routeName: "lvmdp1" },
  { name: "LVMDP 2", routeName: "lvmdp2" },
  { name: "LVMDP 3", routeName: "lvmdp3" },
  { name: "LVMDP 4", routeName: "lvmdp4" },
];

// Compute current page name dari route
const currentPageName = computed(() => {
  const routeName = String(route.name || "");
  const menu = lvmdpMenus.find((m) => m.routeName === routeName);
  return menu?.name || "Dashboard";
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <div class="layout">
    <!-- SIDEBAR: gunakan komponen SideBar dengan class binding -->
    <SideBar
      :class="{
        'sidebar-visible': isSidebarOpen,
        'sidebar-hidden': !isSidebarOpen,
      }"
    />

    <!-- BACKDROP (HP / tablet) -->
    <div
      v-if="isSidebarOpen"
      class="backdrop lg:hidden"
      @click="isSidebarOpen = false"
    />

    <!-- MAIN AREA -->
    <main class="main">
      <header class="topbar">
        <!-- burger SELALU ada (tanpa md:hidden) -->
        <button
          class="hamb"
          type="button"
          aria-label="Toggle sidebar"
          @click="toggleSidebar"
        >
          <svg
            class="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div class="breadcrumb">
          <span class="breadcrumb-item">Dashboard</span>
          <span v-if="currentPageName !== 'Dashboard'" class="breadcrumb-sep"
            >/</span
          >
          <span
            v-if="currentPageName !== 'Dashboard'"
            class="breadcrumb-item active"
          >
            {{ currentPageName }}
          </span>
        </div>

        <div class="ml-auto">
          <span class="badge">Logged in</span>
        </div>
      </header>

      <section class="page" :class="{ 'sidebar-closed-state': !isSidebarOpen }">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  position: relative;
  background: #f8fafc;
}

/* ======================
   SIDEBAR
====================== */
.sidebar-visible {
  transform: translateX(0) !important;
  opacity: 1 !important;
}

.sidebar-hidden {
  transform: translateX(-100%) !important;
  opacity: 0 !important;
}

/* Smooth transition untuk sidebar state */
.layout > :nth-child(1) {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
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

.group-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  text-align: left;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.group-trigger:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.12);
}

.chev {
  transition: transform 0.2s ease;
  color: #64748b;
}

.chev.rot {
  transform: rotate(180deg);
}

.submenu {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 12px;
  margin-top: 6px;
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.submenu-item:hover {
  background-color: rgba(14, 165, 233, 0.15);
  color: #fff;
}

.submenu-item.active {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
}

.dot {
  height: 0.55rem;
  width: 0.55rem;
  border-radius: 9999px;
  background-color: #64748b;
  transition: all 0.2s ease;
}

.submenu-item.active .dot {
  background-color: #fff;
}

/* BACKDROP */
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  z-index: 30;
  backdrop-filter: blur(2px);
}

/* ======================
   MAIN AREA
====================== */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 240px;
  transition: margin-left 0.3s ease;
}

.topbar {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(to right, #ffffff, #f8fafc);
  position: sticky;
  top: 0;
  z-index: 20;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.hamb {
  margin-right: 12px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f1f5f9;
  color: #0f172a;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.hamb:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.hamb:active {
  transform: scale(0.95);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  margin-left: 16px;
  font-size: 0.95rem;
}

.breadcrumb-item {
  color: #64748b;
  font-weight: 500;
}

.breadcrumb-item.active {
  color: #0ea5e9;
  font-weight: 600;
}

.breadcrumb-sep {
  color: #cbd5e1;
}

.topbar-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.5px;
  flex: 1;
  text-align: center;
}

.badge {
  padding: 6px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%);
  color: #15803d;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.1);
}

.page {
  flex: 1;
  overflow-y: auto;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  position: relative;
}

.page > * {
  width: 100%;
  max-width: 1200px; /* bisa kamu atur, misalnya 1100 / 1300 */
}

/* Adjust main area when sidebar is hidden */
.sidebar-hidden ~ .main {
  margin-left: 0;
}

/* Remove margin on mobile */
@media (max-width: 1024px) {
  .main {
    margin-left: 0;
  }
}

/* Animasi fade untuk submenu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* DESKTOP: sidebar toggle behavior */
@media (min-width: 1024px) {
  .layout {
    display: flex;
    width: 100%;
  }

  .sidebar-visible {
    transform: translateX(0) !important;
    opacity: 1 !important;
  }

  .sidebar-hidden {
    transform: translateX(-100%) !important;
    opacity: 0 !important;
    pointer-events: none;
  }

  .main {
    min-height: 100vh;
  }

  /* Ensure hamburger is always visible */
  .hamb {
    display: inline-flex !important;
    visibility: visible !important;
  }
}
</style>
