<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    kw: number;
    iavg: number;
    layout?: "horizontal" | "vertical";
  }>(),
  {
    kw: 0,
    iavg: 0,
    layout: "horizontal",
  }
);

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
</script>

<template>
  <div
    class="rounded-xl p-[1px] bg-gradient-to-br from-white/30 via-white/10 to-white/0 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1"
  >
    <div class="rounded-xl bg-white px-5 py-4">
      <!-- SHIFT badge -->
      <div
        class="mx-auto mb-3 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500/15 to-blue-600/15 ring-1 ring-sky-500/20 text-sky-700 px-3.5 py-1 text-xs font-bold tracking-wide uppercase"
      >
        {{ title }}
      </div>

      <!-- Layout -->
      <div
        v-if="layout === 'horizontal'"
        class="flex items-center justify-between gap-5"
      >
        <!-- kW -->
        <div class="flex-1 flex items-end gap-1.5">
          <span
            class="text-3xl md:text-3xl font-extrabold text-slate-800 leading-none"
          >
            {{ fmt(kw) }}
          </span>
          <div class="mb-1">
            <div class="text-sm font-semibold text-slate-400 leading-none">
              kW
            </div>
            <div class="text-[9px] uppercase tracking-widest text-slate-400">
              Active Power
            </div>
          </div>
        </div>

        <div class="h-8 w-px bg-slate-200/80"></div>

        <!-- Iavg -->
        <div class="flex-1 flex items-end gap-1.5 justify-end">
          <span
            class="text-3xl md:text-3xl font-extrabold text-slate-800 leading-none"
          >
            {{ fmt(iavg) }}
          </span>
          <div class="mb-1">
            <div class="text-sm font-semibold text-slate-400 leading-none">
              A
            </div>
            <div class="text-[9px] uppercase tracking-widest text-slate-400">
              Iavg
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center gap-2.5">
        <div class="flex items-end gap-1.5 leading-none">
          <span class="text-3xl md:text-3xl font-extrabold text-slate-800">{{
            fmt(kw)
          }}</span>
          <span class="text-sm font-semibold text-slate-400 mb-[5px]">kW</span>
        </div>
        <div class="flex items-end gap-1.5 leading-none">
          <span class="text-3xl md:text-3xl font-extrabold text-slate-800">{{
            fmt(iavg)
          }}</span>
          <span class="text-sm font-semibold text-slate-400 mb-[5px]">A</span>
        </div>
      </div>
    </div>
  </div>
</template>
