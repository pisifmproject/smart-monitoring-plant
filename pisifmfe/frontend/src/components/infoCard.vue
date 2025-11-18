<script setup lang="ts">
defineProps<{ label: string; value?: string | number | null }>();
</script>

<template>
  <div class="card">
    <div class="label">{{ label }}</div>
    <div class="value">{{ value ?? 'N/A' }}</div>
  </div>
</template>

<style scoped>
.card { background:#fff; border-radius:12px; padding:12px 14px; box-shadow:0 2px 10px rgba(0,0,0,.05); }
.label { color:#6b7280; font-size:12px; margin-bottom:8px; }
.value { font-size:18px; font-weight:600; color:#111827; }
</style>
