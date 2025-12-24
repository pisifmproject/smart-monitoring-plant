<script setup lang="ts">
import { computed } from "vue";

type UITheme = {
  iconStroke: string;
  dot: string;
  bg: string;
  ring: string;
  textMain: string;
  textSub: string;
  label: string;
};

const props = withDefaults(
  defineProps<{
    connected: boolean;
    text?: string;
    lastUpdate?: string | Date | null;
  }>(),
  {
    text: "",
    lastUpdate: null,
  }
);

const ui = computed<UITheme>(() => {
  if (props.connected) {
    return {
      iconStroke: "stroke-emerald-600",
      dot: "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]",
      bg: "from-emerald-50/60 to-emerald-100/40",
      ring: "ring-emerald-200/60",
      textMain: "text-emerald-800",
      textSub: "text-emerald-700",
      label: "CONNECTED",
    };
  }
  return {
    iconStroke: "stroke-rose-600",
    dot: "bg-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.15)]",
    bg: "from-rose-50/60 to-rose-100/40",
    ring: "ring-rose-200/60",
    textMain: "text-rose-800",
    textSub: "text-rose-700",
    label: "DISCONNECTED",
  };
});
</script>

<template>
  <div
    class="rounded-2xl p-[1px] bg-gradient-to-br from-white/50 via-white/20 to-white/0 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
  >
    <div
      :class="[
        'rounded-2xl ring-1 px-4 py-3 md:px-5 md:py-3.5',
        'bg-gradient-to-r backdrop-blur-sm flex items-center gap-3 md:gap-4',
        ui.bg,
        ui.ring,
      ]"
    >
      <!-- dot -->
      <span :class="['h-2.5 w-2.5 rounded-full md:h-3 md:w-3', ui.dot]" />

      <!-- icon -->
      <svg
        class="size-5 md:size-6"
        viewBox="0 0 24 24"
        fill="none"
        :class="ui.iconStroke"
      >
        <path
          d="M3 12h3l2 4 4-8 2 4h5"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <!-- text -->
      <div class="flex flex-col md:flex-row md:items-baseline md:gap-2">
        <div
          :class="[
            'text-sm md:text-base font-semibold tracking-wide',
            ui.textMain,
          ]"
        >
          Status: <span class="font-extrabold">{{ ui.label }}</span>
        </div>
        <div v-if="text" :class="['text-xs md:text-sm', ui.textSub]">
          • {{ text }}
        </div>
        <div v-if="lastUpdate" :class="['text-xs md:text-sm', ui.textSub]">
          • Last update: {{ new Date(lastUpdate).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>
