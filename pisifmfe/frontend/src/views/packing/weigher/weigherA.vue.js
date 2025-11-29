import { ref, onMounted, computed } from "vue";
import ReportButton from "@/components/reportButton.vue";
const lineId = "LINE_A_WEIGHER";
const loading = ref(false);
const hasData = ref(false);
const weigherData = ref({
    targetPacks: 0,
    actualPacks: 0,
    rejectCount: 0,
    avgWeight: 0,
    minWeight: 0,
    maxWeight: 0,
    efficiency: 0,
});
const shiftSummary = ref({
    shift1: { target: 0, actual: 0, reject: 0, efficiency: 0 },
    shift2: { target: 0, actual: 0, reject: 0, efficiency: 0 },
    shift3: { target: 0, actual: 0, reject: 0, efficiency: 0 },
});
// Status computed berdasarkan ada tidaknya data
const status = computed(() => (hasData.value ? "running" : "offline"));
// Function to fetch weigher data from backend
const fetchWeigherData = async () => {
    loading.value = true;
    try {
        const response = await fetch(`http://localhost:2000/api/packing/weigher/${lineId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
            hasData.value = true;
            weigherData.value = {
                targetPacks: result.data.targetPacks || 0,
                actualPacks: result.data.actualPacks || 0,
                rejectCount: result.data.rejectCount || 0,
                avgWeight: result.data.avgWeight || 0,
                minWeight: result.data.minWeight || 0,
                maxWeight: result.data.maxWeight || 0,
                efficiency: result.data.efficiency || 0,
            };
            // Jika ada data shift summary dari backend
            if (result.data.shifts) {
                result.data.shifts.forEach((shift) => {
                    const shiftKey = `shift${shift.shiftNumber}`;
                    if (shiftSummary.value[shiftKey]) {
                        shiftSummary.value[shiftKey] = {
                            target: shift.target || 0,
                            actual: shift.actual || 0,
                            reject: shift.reject || 0,
                            efficiency: shift.efficiency || 0,
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
        console.error("Error fetching weigher data:", err);
        hasData.value = false;
    }
    finally {
        loading.value = false;
    }
};
onMounted(() => {
    fetchWeigherData();
    // Refresh every 30 seconds
    setInterval(fetchWeigherData, 30000);
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
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
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
/** @type {__VLS_StyleScopedClasses['weigher-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['header-section']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-section']} */ ;
/** @type {__VLS_StyleScopedClasses['weight-section']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-section']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weigher-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weigher-container" },
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
    ...{ class: "header-actions" },
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
    routeName: "dailyReportWeigherA",
    label: "Daily Report - Weigher A",
}));
const __VLS_1 = __VLS_0({
    routeName: "dailyReportWeigherA",
    label: "Daily Report - Weigher A",
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
(__VLS_ctx.weigherData.targetPacks);
// @ts-ignore
[weigherData,];
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
(__VLS_ctx.weigherData.actualPacks);
// @ts-ignore
[weigherData,];
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
(__VLS_ctx.weigherData.rejectCount);
// @ts-ignore
[weigherData,];
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
(__VLS_ctx.weigherData.efficiency);
// @ts-ignore
[weigherData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-unit" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weight-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weight-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weight-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weight-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weight-value" },
});
(__VLS_ctx.weigherData.avgWeight);
// @ts-ignore
[weigherData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weight-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weight-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weight-value" },
});
(__VLS_ctx.weigherData.minWeight);
// @ts-ignore
[weigherData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weight-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weight-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "weight-value" },
});
(__VLS_ctx.weigherData.maxWeight);
// @ts-ignore
[weigherData,];
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
    (data.reject);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-value success" },
    });
    (data.efficiency);
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
/** @type {__VLS_StyleScopedClasses['weigher-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['weigher-container']} */ ;
/** @type {__VLS_StyleScopedClasses['header-section']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
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
/** @type {__VLS_StyleScopedClasses['weight-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['weight-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['weight-card']} */ ;
/** @type {__VLS_StyleScopedClasses['weight-label']} */ ;
/** @type {__VLS_StyleScopedClasses['weight-value']} */ ;
/** @type {__VLS_StyleScopedClasses['weight-card']} */ ;
/** @type {__VLS_StyleScopedClasses['weight-label']} */ ;
/** @type {__VLS_StyleScopedClasses['weight-value']} */ ;
/** @type {__VLS_StyleScopedClasses['weight-card']} */ ;
/** @type {__VLS_StyleScopedClasses['weight-label']} */ ;
/** @type {__VLS_StyleScopedClasses['weight-value']} */ ;
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
