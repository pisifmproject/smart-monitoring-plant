<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";

const props = defineProps<{
  panelId?: number;
  label?: string;
  routeName?: string;
}>();

const router = useRouter();
const { canAccessDailyReport } = useAuth();

function openReport() {
  if (props.routeName) {
    router.push({ name: props.routeName });
  } else if (props.panelId) {
    router.push({
      name: "dailyReport",
      query: { panel: props.panelId },
    });
  }
}
</script>

<template>
  <button
    v-if="canAccessDailyReport()"
    class="report-button"
    @click="openReport"
  >
    <span class="report-icon">📄</span>
    <span class="report-text">{{ label || "Daily Report" }}</span>
  </button>
</template>

<style scoped>
.report-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.report-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4);
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}

.report-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.report-icon {
  font-size: 1.1rem;
}

.report-text {
  letter-spacing: -0.3px;
}

@media (max-width: 768px) {
  .report-button {
    padding: 8px 16px;
    font-size: 0.85rem;
  }

  .report-icon {
    font-size: 1rem;
  }
}
</style>
