<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const plantId = computed(() => String(route.params.plantId || ""));
const machineId = computed(() => String(route.params.machineId || ""));
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white">Machine Dashboard</h1>
    <p class="text-slate-300 mt-2">
      Plant: <span class="font-semibold">{{ plantId }}</span> —
      Machine: <span class="font-semibold">{{ machineId }}</span>
    </p>

    <div class="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <p class="text-slate-300">
        Route ini masih placeholder. Silakan map machineId ke view yang benar
        (pc14, pc39, tws56, dll).
      </p>
    </div>
  </div>
</template>
