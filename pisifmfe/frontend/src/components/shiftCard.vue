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
    class="rounded-2xl p-[1px] bg-gradient-to-br from-white/30 via-white/10 to-white/0 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-shadow duration-200 hover:-translate-y-0.5"
  >
    <div class="rounded-2xl bg-white px-6 py-5">
      <!-- SHIFT badge besar -->
      <div
        class="mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500/15 to-blue-600/15 ring-1 ring-sky-500/20 text-sky-700 px-4 py-1.5 text-sm font-bold tracking-wide uppercase"
      >
        {{ title }}
      </div>

      <!-- Layout -->
      <div
        v-if="layout === 'horizontal'"
        class="flex items-center justify-between gap-6"
      >
        <!-- kW -->
        <div class="flex-1 flex items-end gap-2">
          <span
            class="text-4xl md:text-5xl font-extrabold text-slate-800 leading-none"
          >
            {{ fmt(kw) }}
          </span>
          <div class="mb-1.5">
            <div class="text-base font-semibold text-slate-400 leading-none">
              kW
            </div>
            <div class="text-[10px] uppercase tracking-widest text-slate-400">
              Active Power
            </div>
          </div>
        </div>

        <div class="h-10 w-px bg-slate-200/80"></div>

        <!-- Iavg -->
        <div class="flex-1 flex items-end gap-2 justify-end">
          <span
            class="text-4xl md:text-5xl font-extrabold text-slate-800 leading-none"
          >
            {{ fmt(iavg) }}
          </span>
          <div class="mb-1.5">
            <div class="text-base font-semibold text-slate-400 leading-none">
              A
            </div>
            <div class="text-[10px] uppercase tracking-widest text-slate-400">
              Iavg
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center gap-3">
        <div class="flex items-end gap-2 leading-none">
          <span class="text-4xl md:text-5xl font-extrabold text-slate-800">{{
            fmt(kw)
          }}</span>
          <span class="text-base font-semibold text-slate-400 mb-[6px]"
            >kW</span
          >
        </div>
        <div class="flex items-end gap-2 leading-none">
          <span class="text-4xl md:text-5xl font-extrabold text-slate-800">{{
            fmt(iavg)
          }}</span>
          <span class="text-base font-semibold text-slate-400 mb-[6px]">A</span>
        </div>
      </div>
    </div>
  </div>
</template>
