import { ref, onMounted, computed } from "vue";
import ReportButton from "@/components/reportButton.vue";
const lineId = "LINE_A_TS1000";
const loading = ref(false);
const hasData = ref(false);
const productionData = ref({
    targetProduction: 0,
    actualProduction: 0,
    defectCount: 0,
    oeePercentage: 0,
    availability: 0,
    performance: 0,
    quality: 0,
    kwhMeter: 0,
    powerConsumption: 0,
    voltageInput: 0,
    currentAmpere: 0,
});
const shiftSummary = ref({
    shift1: { target: 0, actual: 0, defect: 0, oee: 0 },
    shift2: { target: 0, actual: 0, defect: 0, oee: 0 },
    shift3: { target: 0, actual: 0, defect: 0, oee: 0 },
});
// Status computed berdasarkan ada tidaknya data
const status = computed(() => (hasData.value ? "running" : "offline"));
// Function to fetch production data from backend
const fetchProductionData = async () => {
    loading.value = true;
    try {
        const response = await fetch(`http://localhost:2000/api/production/${lineId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
            hasData.value = true;
            productionData.value = {
                targetProduction: result.data.targetProduction || 0,
                actualProduction: result.data.actualProduction || 0,
                defectCount: result.data.defectCount || 0,
                oeePercentage: result.data.oeePercentage || 0,
                availability: result.data.availability || 0,
                performance: result.data.performance || 0,
                quality: result.data.quality || 0,
                kwhMeter: result.data.kwhMeter || 0,
                powerConsumption: result.data.powerConsumption || 0,
                voltageInput: result.data.voltageInput || 0,
                currentAmpere: result.data.currentAmpere || 0,
            };
            // Jika ada data shift summary dari backend
            if (result.data.shifts) {
                result.data.shifts.forEach((shift) => {
                    const shiftKey = `shift${shift.shiftNumber}`;
                    if (shiftSummary.value[shiftKey]) {
                        shiftSummary.value[shiftKey] = {
                            target: shift.target || 0,
                            actual: shift.actual || 0,
                            defect: shift.defect || 0,
                            oee: shift.oee || 0,
                        };
                    }
                });
            }
        }
        else {
            hasData.value = false;
        }
    }
    catch (err) {
        console.error("Error fetching production data:", err);
        hasData.value = false;
    }
    finally {
        loading.value = false;
    }
};
onMounted(() => {
    fetchProductionData();
    // Refresh every 30 seconds
    setInterval(fetchProductionData, 30000);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-card']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-card']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-card']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-label']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-card']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-label']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-card']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-value']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-card']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-value']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-card']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-card']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-label']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-value']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-value']} */ ;
/** @type {__VLS_StyleScopedClasses['production-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['header-section']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-section']} */ ;
/** @type {__VLS_StyleScopedClasses['oee-section']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-section']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "production-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "production-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "page-subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "status-badge" },
    ...{ class: (__VLS_ctx.status) },
});
// @ts-ignore
[status,];
(__VLS_ctx.status.toUpperCase());
// @ts-ignore
[status,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "report-button-container" },
});
/** @type {[typeof ReportButton, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ReportButton, new ReportButton({
    routeName: "dailyReportTS1000",
    label: "Daily Report - TS1000",
}));
const __VLS_1 = __VLS_0({
    routeName: "dailyReportTS1000",
    label: "Daily Report - TS1000",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metrics-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-value" },
});
(__VLS_ctx.productionData.targetProduction);
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-unit" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-value" },
});
(__VLS_ctx.productionData.actualProduction);
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-unit" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-value danger" },
});
(__VLS_ctx.productionData.defectCount);
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-unit" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-card highlight" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-value" },
});
(__VLS_ctx.productionData.oeePercentage);
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-unit" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "oee-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "oee-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "oee-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "oee-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "oee-value" },
});
(__VLS_ctx.productionData.availability);
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "oee-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "oee-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "oee-value" },
});
(__VLS_ctx.productionData.performance);
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "oee-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "oee-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "oee-value" },
});
(__VLS_ctx.productionData.quality);
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "title-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-card highlight" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-value" },
});
(__VLS_ctx.productionData.kwhMeter.toLocaleString());
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-unit" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-value" },
});
(__VLS_ctx.productionData.powerConsumption.toLocaleString());
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-unit" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-value" },
});
(__VLS_ctx.productionData.voltageInput);
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-unit" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-value" },
});
(__VLS_ctx.productionData.currentAmpere);
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "kwh-unit" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "power-gauge-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "gauge-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "gauge-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "gauge-circle" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    viewBox: "0 0 200 200",
    ...{ class: "gauge-svg" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.circle)({
    cx: "100",
    cy: "100",
    r: "80",
    fill: "none",
    stroke: "#e2e8f0",
    'stroke-width': "20",
});
__VLS_asFunctionalElement(__VLS_intrinsics.circle)({
    cx: "100",
    cy: "100",
    r: "80",
    fill: "none",
    stroke: "url(#powerGradient)",
    'stroke-width': "20",
    'stroke-linecap': "round",
    'stroke-dasharray': (`${(__VLS_ctx.productionData.powerConsumption / 1000) * 502} 502`),
    transform: "rotate(-90 100 100)",
    ...{ class: "gauge-progress" },
});
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.defs, __VLS_intrinsics.defs)({});
__VLS_asFunctionalElement(__VLS_intrinsics.linearGradient, __VLS_intrinsics.linearGradient)({
    id: "powerGradient",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%",
});
__VLS_asFunctionalElement(__VLS_intrinsics.stop)({
    offset: "0%",
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsics.stop)({
    offset: "50%",
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsics.stop)({
    offset: "100%",
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "gauge-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "gauge-value" },
});
(__VLS_ctx.productionData.powerConsumption);
// @ts-ignore
[productionData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "gauge-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "gauge-indicators" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "indicator low" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "indicator mid" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "indicator high" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "shift-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "shift-grid" },
});
for (const [data, shift] of __VLS_getVForSourceType((__VLS_ctx.shiftSummary))) {
    // @ts-ignore
    [shiftSummary,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (shift),
        ...{ class: "shift-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-header" },
    });
    (shift.toUpperCase());
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-value" },
    });
    (data.target);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-value" },
    });
    (data.actual);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-value danger" },
    });
    (data.defect);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-value success" },
    });
    (data.oee);
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "note-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "note-text" },
});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
else if (!__VLS_ctx.hasData) {
    // @ts-ignore
    [hasData,];
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
/** @type {__VLS_StyleScopedClasses['production-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['production-container']} */ ;
/** @type {__VLS_StyleScopedClasses['header-section']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['report-button-container']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-section']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-label']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-label']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-label']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-label']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['oee-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['oee-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['oee-card']} */ ;
/** @type {__VLS_StyleScopedClasses['oee-label']} */ ;
/** @type {__VLS_StyleScopedClasses['oee-value']} */ ;
/** @type {__VLS_StyleScopedClasses['oee-card']} */ ;
/** @type {__VLS_StyleScopedClasses['oee-label']} */ ;
/** @type {__VLS_StyleScopedClasses['oee-value']} */ ;
/** @type {__VLS_StyleScopedClasses['oee-card']} */ ;
/** @type {__VLS_StyleScopedClasses['oee-label']} */ ;
/** @type {__VLS_StyleScopedClasses['oee-value']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-card']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-content']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-label']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-value']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-card']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-content']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-label']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-value']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-card']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-content']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-label']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-value']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-card']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-content']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-label']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-value']} */ ;
/** @type {__VLS_StyleScopedClasses['kwh-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['power-gauge-container']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-title']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-svg']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-value']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-label']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-indicators']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['low']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['mid']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['high']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-card']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-header']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-content']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-label']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-value']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-label']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-value']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-label']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-value']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-label']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-value']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['note-section']} */ ;
/** @type {__VLS_StyleScopedClasses['note-text']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
