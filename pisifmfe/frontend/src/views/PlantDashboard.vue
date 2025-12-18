<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import SummaryPanelDashboard from "@/views/summary/SummaryPanelDashboard.vue";
import LegacyPlantDashboard from "@/views/LegacyPlantDashboard.vue";

const route = useRoute();
const plantId = computed(() => String(route.params.plantId || ""));
const isCikupa = computed(() => plantId.value.toUpperCase() === "CIKUPA");
</script>

<template>
  <!-- CIKUPA pakai SummaryPanelDashboard -->
  <SummaryPanelDashboard v-if="isCikupa" />

  <!-- selain CIKUPA pakai dashboard lama -->
  <LegacyPlantDashboard v-else />
</template>
