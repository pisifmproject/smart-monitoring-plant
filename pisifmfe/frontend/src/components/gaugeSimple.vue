<script setup lang="ts">
import * as echarts from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { onMounted, onBeforeUnmount, ref, watch, computed } from "vue";

echarts.use([GaugeChart, CanvasRenderer]);

interface Props {
  title: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}
const props = defineProps<Props>();

const el = ref<HTMLDivElement | null>(null);
let chart: echarts.ECharts | null = null;

// hitung persentase (untuk warna dinamis)
const pct = computed(() => {
  const range = props.max - props.min || 1;
  const v = Math.max(props.min, Math.min(props.max, props.value));
  return (v - props.min) / range;
});

// warna progress tergantung persentase
const barColor = computed(() => {
  const p = pct.value * 100;
  if (p >= 81) return "#16a34a"; // hijau
  if (p >= 61) return "#f59e0b"; // kuning
  if (p >= 25) return "#60a5fa"; // biru
  return "#ef4444"; // merah
});

function setOption() {
  if (!chart) return;
  const v = Math.max(props.min, Math.min(props.max, props.value));

  chart.setOption(
    {
      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          min: props.min,
          max: props.max,
          radius: "100%",
          center: ["50%", "65%"], // agak ke bawah
          splitNumber: 0,
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 20,
              color: [
                [pct.value, barColor.value],
                [1, "#e5e7eb"],
              ],
            },
          },
          pointer: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: {
            show: true,
            distance: 6,
            color: "#9ca3af",
            fontSize: 10,
            formatter: (val: number) =>
              val === props.min || val === props.max ? String(val) : "",
          },
          title: { show: false },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, -6],
            rich: {
              v: {
                fontSize: 32,
                fontWeight: 700,
                color: "#111827",
                lineHeight: 34,
              },
              u: { fontSize: 12, color: "#9ca3af", lineHeight: 16 },
            },
            formatter: () => {
              const formatted = props.title
                .toLowerCase()
                .includes("power factor")
                ? v.toFixed(2)
                : Math.round(v); // selain itu, 1 angka desimal aja

              // : Math.round(v * 10) / 10; // selain itu, 1 angka desimal aja

              return `{v|${formatted}}\n{u|${props.unit}}`;
            },
          },
          data: [{ value: v }],
        },
      ],
    },
    true
  );
}

function resize() {
  chart?.resize();
}

onMounted(() => {
  chart = echarts.init(el.value!);
  setOption();
  window.addEventListener("resize", resize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
  chart?.dispose();
  chart = null;
});
watch(() => [props.value, props.min, props.max], setOption);
</script>

<template>
  <div class="gauge-e">
    <div ref="el" class="chart"></div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<style scoped>
.gauge-e {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.chart {
  width: 100%;
  height: 160px;
}

.title {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  text-align: center;
}

@media (max-width: 1024px) {
  .chart {
    height: 150px;
  }
}

@media (max-width: 768px) {
  .chart {
    height: 140px;
  }
}
</style>
