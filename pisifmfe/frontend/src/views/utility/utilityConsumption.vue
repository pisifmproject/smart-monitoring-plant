<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import {
  Zap,
  Droplet,
  Droplets,
  Flame,
  Fuel,
  CloudRain,
  Wind,
  FlaskConical,
} from "lucide-vue-next";
import * as echarts from "echarts/core";
import { LineChart, GaugeChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  GaugeChart,
  BarChart,
  CanvasRenderer,
]);

interface Props {
  machineName: string;
}

const props = defineProps<Props>();

type UtilityTab =
  | "electricity"
  | "freshWater"
  | "wasteWater"
  | "naturalGas"
  | "fuelOil"
  | "steam"
  | "air"
  | "nitrogen";

type TimeRange = "7days" | "30days" | "12months";

const activeTab = ref<UtilityTab>("electricity");
const selectedRange = ref<TimeRange>("7days");

const tabs = [
  {
    id: "electricity" as UtilityTab,
    name: "Electricity",
    icon: Zap,
    color: "#eab308",
  },
  {
    id: "freshWater" as UtilityTab,
    name: "Fresh Water",
    icon: Droplet,
    color: "#06b6d4",
  },
  {
    id: "wasteWater" as UtilityTab,
    name: "Waste Water",
    icon: Droplets,
    color: "#64748b",
  },
  {
    id: "naturalGas" as UtilityTab,
    name: "Natural Gas",
    icon: Flame,
    color: "#f97316",
  },
  {
    id: "fuelOil" as UtilityTab,
    name: "Fuel Oil",
    icon: Fuel,
    color: "#78350f",
  },
  {
    id: "steam" as UtilityTab,
    name: "Steam",
    icon: CloudRain,
    color: "#94a3b8",
  },
  {
    id: "air" as UtilityTab,
    name: "Air",
    icon: Wind,
    color: "#38bdf8",
  },
  {
    id: "nitrogen" as UtilityTab,
    name: "Nitrogen",
    icon: FlaskConical,
    color: "#a78bfa",
  },
];

// Utility data
const utilityData = ref({
  today: 0,
  yesterday: 0,
  unit: "unit",
});

const chartData = ref<{ date: string; today: number; yesterday: number }[]>([]);
const loading = ref(false);
const chartInstance = ref<echarts.ECharts | null>(null);
const gaugeInstance = ref<echarts.ECharts | null>(null);

// Convert machine name to machine ID
function getMachineId(name: string): string {
  const mapping: Record<string, string> = {
    "PC 14": "PC14",
    "PC 39": "PC39",
    "Cassava Inhouse": "CassavaInhouse",
    "Cassava Copack": "CassavaCopack",
    Tortila: "Tortila",
    FCP: "FCP",
    "TWS 5.6": "TWS56",
    "TWS 7.2": "TWS72",
    "Packing Pouch (Promina Puff)": "PackingPouch",
    "Vacuum Fryer 1": "VacuumFryer",
  };
  return mapping[name] || "PC14";
}

// Generate realistic dummy data based on machine and utility type
function generateDummyData() {
  const machineId = getMachineId(props.machineName);
  const utilityType = activeTab.value;

  // Base values per machine per utility
  const baseValues: Record<
    string,
    Record<UtilityTab, { daily: number; monthly: number }>
  > = {
    PC14: {
      electricity: { daily: 1500, monthly: 42000 },
      freshWater: { daily: 120, monthly: 3400 },
      wasteWater: { daily: 95, monthly: 2700 },
      naturalGas: { daily: 80, monthly: 2300 },
      fuelOil: { daily: 250, monthly: 7200 },
      steam: { daily: 1800, monthly: 52000 },
      air: { daily: 450, monthly: 13000 },
      nitrogen: { daily: 35, monthly: 1000 },
    },
    PC39: {
      electricity: { daily: 1600, monthly: 45000 },
      freshWater: { daily: 130, monthly: 3700 },
      wasteWater: { daily: 100, monthly: 2900 },
      naturalGas: { daily: 85, monthly: 2400 },
      fuelOil: { daily: 270, monthly: 7800 },
      steam: { daily: 1900, monthly: 55000 },
      air: { daily: 480, monthly: 14000 },
      nitrogen: { daily: 38, monthly: 1100 },
    },
    CassavaInhouse: {
      electricity: { daily: 1200, monthly: 34000 },
      freshWater: { daily: 200, monthly: 5800 },
      wasteWater: { daily: 160, monthly: 4600 },
      naturalGas: { daily: 60, monthly: 1700 },
      fuelOil: { daily: 180, monthly: 5200 },
      steam: { daily: 1500, monthly: 43000 },
      air: { daily: 350, monthly: 10000 },
      nitrogen: { daily: 25, monthly: 700 },
    },
    CassavaCopack: {
      electricity: { daily: 1400, monthly: 40000 },
      freshWater: { daily: 150, monthly: 4300 },
      wasteWater: { daily: 120, monthly: 3400 },
      naturalGas: { daily: 70, monthly: 2000 },
      fuelOil: { daily: 220, monthly: 6300 },
      steam: { daily: 1700, monthly: 49000 },
      air: { daily: 420, monthly: 12000 },
      nitrogen: { daily: 32, monthly: 920 },
    },
    Tortila: {
      electricity: { daily: 1100, monthly: 32000 },
      freshWater: { daily: 110, monthly: 3200 },
      wasteWater: { daily: 85, monthly: 2500 },
      naturalGas: { daily: 90, monthly: 2600 },
      fuelOil: { daily: 200, monthly: 5800 },
      steam: { daily: 1400, monthly: 40000 },
      air: { daily: 380, monthly: 11000 },
      nitrogen: { daily: 28, monthly: 800 },
    },
    FCP: {
      electricity: { daily: 1700, monthly: 48000 },
      freshWater: { daily: 140, monthly: 4000 },
      wasteWater: { daily: 110, monthly: 3100 },
      naturalGas: { daily: 75, monthly: 2100 },
      fuelOil: { daily: 260, monthly: 7500 },
      steam: { daily: 2000, monthly: 58000 },
      air: { daily: 500, monthly: 14500 },
      nitrogen: { daily: 40, monthly: 1150 },
    },
    TWS56: {
      electricity: { daily: 1350, monthly: 38000 },
      freshWater: { daily: 125, monthly: 3600 },
      wasteWater: { daily: 98, monthly: 2800 },
      naturalGas: { daily: 68, monthly: 1950 },
      fuelOil: { daily: 230, monthly: 6600 },
      steam: { daily: 1650, monthly: 47000 },
      air: { daily: 440, monthly: 12700 },
      nitrogen: { daily: 33, monthly: 950 },
    },
    TWS72: {
      electricity: { daily: 1450, monthly: 41000 },
      freshWater: { daily: 135, monthly: 3900 },
      wasteWater: { daily: 105, monthly: 3000 },
      naturalGas: { daily: 72, monthly: 2050 },
      fuelOil: { daily: 245, monthly: 7000 },
      steam: { daily: 1750, monthly: 50000 },
      air: { daily: 460, monthly: 13200 },
      nitrogen: { daily: 36, monthly: 1030 },
    },
    PackingPouch: {
      electricity: { daily: 900, monthly: 26000 },
      freshWater: { daily: 80, monthly: 2300 },
      wasteWater: { daily: 60, monthly: 1700 },
      naturalGas: { daily: 45, monthly: 1300 },
      fuelOil: { daily: 150, monthly: 4300 },
      steam: { daily: 1100, monthly: 32000 },
      air: { daily: 300, monthly: 8600 },
      nitrogen: { daily: 20, monthly: 580 },
    },
    VacuumFryer: {
      electricity: { daily: 1800, monthly: 52000 },
      freshWater: { daily: 160, monthly: 4600 },
      wasteWater: { daily: 130, monthly: 3700 },
      naturalGas: { daily: 95, monthly: 2700 },
      fuelOil: { daily: 300, monthly: 8600 },
      steam: { daily: 2100, monthly: 60000 },
      air: { daily: 520, monthly: 15000 },
      nitrogen: { daily: 42, monthly: 1200 },
    },
  };

  const base = baseValues[machineId]?.[utilityType] || {
    daily: 1000,
    monthly: 30000,
  };

  // Add some randomness to make it realistic (±15%)
  const todayValue = Math.round(base.daily * (0.85 + Math.random() * 0.3));
  const yesterdayValue = Math.round(base.daily * (0.8 + Math.random() * 0.35));

  utilityData.value = {
    today: todayValue,
    yesterday: yesterdayValue,
    unit: getUnitForTab(utilityType),
  };

  generateChartData();
  setTimeout(() => {
    initGauge();
  }, 100);
}

// Generate chart data based on selected range
function generateChartData() {
  const baseToday = utilityData.value.today;
  const baseYesterday = utilityData.value.yesterday;

  const data: { date: string; today: number; yesterday: number }[] = [];

  if (selectedRange.value === "7days") {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
      const todayVariance = 0.85 + Math.random() * 0.3;
      const yesterdayVariance = 0.8 + Math.random() * 0.35;
      data.push({
        date: dateStr,
        today: Math.round(baseToday * todayVariance),
        yesterday: Math.round(baseYesterday * yesterdayVariance),
      });
    }
  } else if (selectedRange.value === "30days") {
    // Last 30 days (show every 3 days)
    for (let i = 30; i >= 0; i -= 3) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
      const todayVariance = 0.85 + Math.random() * 0.3;
      const yesterdayVariance = 0.8 + Math.random() * 0.35;
      data.push({
        date: dateStr,
        today: Math.round(baseToday * todayVariance),
        yesterday: Math.round(baseYesterday * yesterdayVariance),
      });
    }
  } else {
    // Last 12 months - aggregate monthly data
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const dateStr = date.toLocaleDateString("id-ID", {
        month: "short",
        year: "2-digit",
      });
      const todayVariance = 0.75 + Math.random() * 0.4;
      const yesterdayVariance = 0.7 + Math.random() * 0.45;
      data.push({
        date: dateStr,
        today: Math.round(baseToday * 30 * todayVariance),
        yesterday: Math.round(baseYesterday * 30 * yesterdayVariance),
      });
    }
  }

  chartData.value = data;
}

// Initialize chart
function initChart() {
  const chartDom = document.getElementById("utilityChart");
  if (!chartDom) return;

  if (chartInstance.value) {
    chartInstance.value.dispose();
  }

  chartInstance.value = echarts.init(chartDom);
  updateChart();
}

// Initialize gauge
function initGauge() {
  const gaugeDom = document.getElementById("utilityGauge");
  if (!gaugeDom) return;

  if (gaugeInstance.value) {
    gaugeInstance.value.dispose();
  }

  gaugeInstance.value = echarts.init(gaugeDom);
  updateGauge();
}

// Update gauge
function updateGauge() {
  if (!gaugeInstance.value) return;

  const today = utilityData.value.today;
  const yesterday = utilityData.value.yesterday;
  const maxValue = Math.max(today, yesterday) * 1.2;
  const percentage =
    yesterday > 0 ? Math.round((today / yesterday) * 100) : 100;

  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: maxValue,
        splitNumber: 4,
        axisLine: {
          lineStyle: {
            width: 25,
            color: [
              [0.33, "#22c55e"],
              [0.66, "#eab308"],
              [1, "#ef4444"],
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: "#1e293b",
          },
          width: 6,
        },
        axisTick: {
          distance: -30,
          length: 8,
          lineStyle: {
            color: "#fff",
            width: 2,
          },
        },
        splitLine: {
          distance: -40,
          length: 20,
          lineStyle: {
            color: "#fff",
            width: 3,
          },
        },
        axisLabel: {
          distance: -55,
          color: "#64748b",
          fontSize: 12,
          formatter: (value: number) => Math.round(value).toLocaleString(),
        },
        detail: {
          valueAnimation: true,
          formatter: "{value} " + utilityData.value.unit,
          color: "#1e293b",
          fontSize: 24,
          fontWeight: "bold",
          offsetCenter: [0, "80%"],
        },
        data: [{ value: today, name: "Today" }],
      },
    ],
  };

  gaugeInstance.value.setOption(option);
}

// Update chart with current data
function updateChart() {
  if (!chartInstance.value || chartData.value.length === 0) return;

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      borderColor: "#334155",
      textStyle: {
        color: "#e2e8f0",
      },
      formatter: (params: any) => {
        let result = `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>`;
        params.forEach((param: any) => {
          const value = param.value.toLocaleString();
          result += `<div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color};"></span>
            <span>${param.seriesName}: <strong>${value} ${utilityData.value.unit}</strong></span>
          </div>`;
        });
        return result;
      },
    },
    legend: {
      data: ["Today", "Yesterday"],
      textStyle: {
        color: "#1e293b",
        fontSize: 14,
        fontWeight: "600",
      },
      top: 10,
      itemWidth: 30,
      itemHeight: 14,
      itemGap: 20,
    },
    grid: {
      left: "60px",
      right: "30px",
      bottom: "50px",
      top: "60px",
      containLabel: false,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: chartData.value.map((d) => d.date),
      name: "Tanggal",
      nameLocation: "middle",
      nameGap: 35,
      nameTextStyle: {
        color: "#1e293b",
        fontSize: 15,
        fontWeight: "700",
      },
      axisLine: {
        lineStyle: {
          color: "#cbd5e1",
          width: 2,
        },
      },
      axisLabel: {
        color: "#475569",
        fontSize: 13,
        fontWeight: "600",
        rotate: selectedRange.value === "30days" ? 45 : 0,
      },
    },
    yAxis: {
      type: "value",
      name: `Konsumsi (${utilityData.value.unit})`,
      nameLocation: "middle",
      nameGap: 50,
      nameTextStyle: {
        color: "#1e293b",
        fontSize: 15,
        fontWeight: "700",
      },
      axisLine: {
        lineStyle: {
          color: "#cbd5e1",
          width: 2,
        },
      },
      axisLabel: {
        color: "#475569",
        fontSize: 13,
        fontWeight: "600",
        formatter: (value: number) => value.toLocaleString(),
      },
      splitLine: {
        lineStyle: {
          color: "#e2e8f0",
          type: "dashed",
          width: 1,
        },
      },
    },
    series: [
      {
        name: "Today",
        type: "line",
        data: chartData.value.map((d) => d.today),
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          width: 4,
          color: "#3b82f6",
          shadowColor: "rgba(59, 130, 246, 0.5)",
          shadowBlur: 10,
        },
        itemStyle: {
          color: "#3b82f6",
          borderColor: "#fff",
          borderWidth: 2,
        },
        emphasis: {
          scale: 1.5,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(59, 130, 246, 0.4)" },
              { offset: 1, color: "rgba(59, 130, 246, 0.05)" },
            ],
          },
        },
      },
      {
        name: "Yesterday",
        type: "line",
        data: chartData.value.map((d) => d.yesterday),
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: {
          width: 3,
          color: "#f97316",
          type: "dashed",
          shadowColor: "rgba(249, 115, 22, 0.4)",
          shadowBlur: 8,
        },
        itemStyle: {
          color: "#f97316",
          borderColor: "#fff",
          borderWidth: 2,
        },
        emphasis: {
          scale: 1.5,
        },
      },
    ],
  };

  chartInstance.value.setOption(option);
}

// Load dummy data
function loadUtilityData() {
  loading.value = true;
  setTimeout(() => {
    generateDummyData();
    loading.value = false;
    setTimeout(() => {
      initChart();
    }, 100);
  }, 300);
}

// Watch for tab changes
watch(activeTab, () => {
  loadUtilityData();
});

// Watch for range changes
watch(selectedRange, () => {
  generateChartData();
  updateChart();
});

// Load data on mount
onMounted(() => {
  loadUtilityData();
  window.addEventListener("resize", () => {
    chartInstance.value?.resize();
    gaugeInstance.value?.resize();
  });
});

function getUnitForTab(tab: UtilityTab): string {
  const units: Record<UtilityTab, string> = {
    electricity: "kWh",
    freshWater: "m³",
    wasteWater: "m³",
    naturalGas: "m³",
    fuelOil: "Liter",
    steam: "kg",
    air: "m³",
    nitrogen: "m³",
  };
  return units[tab];
}

function calculateDifference(): {
  value: number;
  percentage: number;
  isIncrease: boolean;
} {
  const today = utilityData.value.today;
  const yesterday = utilityData.value.yesterday;
  const diff = today - yesterday;
  const percentage = yesterday > 0 ? Math.round((diff / yesterday) * 100) : 0;
  return {
    value: Math.abs(diff),
    percentage: Math.abs(percentage),
    isIncrease: diff > 0,
  };
}
</script>

<template>
  <div class="utility-wrapper">
    <div class="utility-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <div class="header-left">
            <div class="icon-circle">⚙️</div>
            <div>
              <h1 class="page-title">Utility Consumption</h1>
              <p class="page-subtitle">{{ machineName }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <div class="tabs-scroll">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-button', { active: activeTab === tab.id }]"
            :style="{
              '--tab-color': tab.color,
            }"
          >
            <component :is="tab.icon" class="tab-icon" />
            <span class="tab-label">{{ tab.name }}</span>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-section">
        <!-- Summary Cards -->
        <div class="summary-grid">
          <!-- Gauge Card -->
          <div class="summary-card gauge-card">
            <div class="card-header">
              <div class="card-title-wrapper">
                <span class="card-icon">📊</span>
                <h3 class="card-title">Current Consumption</h3>
              </div>
              <span class="card-badge">Live</span>
            </div>
            <div class="card-body">
              <div id="utilityGauge" style="width: 100%; height: 300px"></div>
            </div>
          </div>

          <!-- Comparison Card -->
          <div class="summary-card comparison-card">
            <div class="card-header">
              <div class="card-title-wrapper">
                <span class="card-icon">📈</span>
                <h3 class="card-title">Daily Comparison</h3>
              </div>
              <span class="card-badge comparison">Analysis</span>
            </div>
            <div class="card-body">
              <div class="comparison-container">
                <div class="comparison-item today-item">
                  <div class="item-header">
                    <span class="item-icon">☀️</span>
                    <span class="comparison-label">Today</span>
                  </div>
                  <div class="comparison-value">
                    <span class="value-large">{{
                      utilityData.today.toLocaleString()
                    }}</span>
                    <span class="value-unit">{{ utilityData.unit }}</span>
                  </div>
                  <div class="item-footer">Current Period</div>
                </div>
                <div class="comparison-divider">
                  <div class="divider-line"></div>
                </div>
                <div class="comparison-item yesterday-item">
                  <div class="item-header">
                    <span class="item-icon">🕐</span>
                    <span class="comparison-label">Yesterday</span>
                  </div>
                  <div class="comparison-value">
                    <span class="value-large">{{
                      utilityData.yesterday.toLocaleString()
                    }}</span>
                    <span class="value-unit">{{ utilityData.unit }}</span>
                  </div>
                  <div class="item-footer">Previous Period</div>
                </div>
              </div>
              <div class="difference-section">
                <div
                  :class="[
                    'difference-badge',
                    calculateDifference().isIncrease ? 'increase' : 'decrease',
                  ]"
                >
                  <span class="difference-icon">{{
                    calculateDifference().isIncrease ? "↑" : "↓"
                  }}</span>
                  <span class="difference-text">
                    {{
                      calculateDifference().isIncrease
                        ? "Increased"
                        : "Decreased"
                    }}
                    by
                    {{ Math.abs(calculateDifference().value).toLocaleString() }}
                    {{ utilityData.unit }}
                  </span>
                  <span class="difference-percentage">
                    {{ calculateDifference().percentage }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div class="chart-container">
          <div class="chart-header">
            <h3 class="chart-title">Consumption Trend</h3>
            <div class="chart-controls">
              <button
                @click="selectedRange = '7days'"
                :class="[
                  'control-button',
                  { active: selectedRange === '7days' },
                ]"
              >
                7 Days
              </button>
              <button
                @click="selectedRange = '30days'"
                :class="[
                  'control-button',
                  { active: selectedRange === '30days' },
                ]"
              >
                30 Days
              </button>
              <button
                @click="selectedRange = '12months'"
                :class="[
                  'control-button',
                  { active: selectedRange === '12months' },
                ]"
              >
                12 Months
              </button>
            </div>
          </div>
          <div class="chart-body">
            <div id="utilityChart" style="width: 100%; height: 400px"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.utility-wrapper {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

.utility-container {
  width: 100%;
  background: #f8fafc;
  min-height: 100vh;
}

/* Header */
.header-section {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 32px 48px;
  border-bottom: 3px solid #0ea5e9;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin: 4px 0 0 0;
}

/* Tabs */
.tabs-container {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 48px;
  overflow-x: auto;
}

.tabs-scroll {
  display: flex;
  gap: 8px;
  min-width: max-content;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button:hover {
  background: #f8fafc;
  color: var(--tab-color);
}

.tab-button.active {
  color: var(--tab-color);
  border-bottom-color: var(--tab-color);
  background: linear-gradient(
    to bottom,
    rgba(var(--tab-color-rgb), 0.05),
    transparent
  );
}

.tab-icon {
  width: 20px;
  height: 20px;
}

.tab-label {
  font-weight: 600;
}

/* Content */
.content-section {
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Summary Grid */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 32px;
}

.summary-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e2e8f0;
}

.summary-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
  border-color: #cbd5e1;
}

.card-header {
  padding: 24px 28px;
  background: linear-gradient(135deg, #f8fafc 0%, #e8f3fc 100%);
  border-bottom: 2px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.card-badge {
  padding: 8px 16px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  animation: pulse 2s infinite;
}

.card-badge.comparison {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.card-body {
  padding: 28px;
}

/* Gauge Card */
.gauge-card .card-body {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Comparison Card */
.comparison-card .card-body {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 32px;
}

.comparison-container {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 24px;
}

.comparison-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.comparison-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.today-item {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 3px solid #3b82f6;
  position: relative;
  overflow: hidden;
}

.today-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
}

.yesterday-item {
  background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
  border: 3px solid #f97316;
  position: relative;
  overflow: hidden;
}

.yesterday-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f97316 0%, #ea580c 100%);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.item-icon {
  font-size: 1.5rem;
}

.comparison-label {
  font-size: 0.95rem;
  color: #475569;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.comparison-value {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: 8px;
  margin: 16px 0;
}

.value-large {
  font-size: 2.5rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1;
}

.value-unit {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 700;
}

.item-footer {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  font-style: italic;
  margin-top: auto;
}

.comparison-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  position: relative;
}

.divider-line {
  width: 2px;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    #cbd5e1 20%,
    #cbd5e1 80%,
    transparent 100%
  );
  position: relative;
}

.divider-line::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #cbd5e1;
  border-radius: 50%;
  box-shadow: 0 0 0 4px white;
}

.difference-section {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}

.difference-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.difference-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.difference-badge.increase {
  background: linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%);
  color: #dc2626;
  border: 3px solid #ef4444;
}

.difference-badge.decrease {
  background: linear-gradient(135deg, #dcfce7 0%, #86efac 100%);
  color: #16a34a;
  border: 3px solid #22c55e;
}

.difference-icon {
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}

.difference-text {
  font-size: 1rem;
  flex: 1;
}

.difference-percentage {
  font-size: 1.25rem;
  font-weight: 900;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

.metric-primary {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
}

.metric-value {
  font-size: 3rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.metric-unit {
  font-size: 1.25rem;
  color: #64748b;
  font-weight: 600;
}

.metric-secondary {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
}

.metric-text {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
}

/* Chart */
.chart-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.chart-header {
  padding: 24px 28px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.control-button {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.control-button.active {
  background: #0ea5e9;
  color: white;
  border-color: #0ea5e9;
}

.chart-body {
  padding: 32px;
  min-height: 450px;
  background: #f8fafc;
}

#utilityChart {
  background: white;
  border-radius: 12px;
  padding: 16px;
}

/* Responsive */
@media (max-width: 1200px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-section {
    padding: 24px;
  }

  .content-section {
    padding: 24px;
  }

  .tabs-container {
    padding: 0 24px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .icon-circle {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
}
</style>
