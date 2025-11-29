import { ref, onMounted, computed } from "vue";
import ReportButton from "@/components/reportButton.vue";
const lineId = "LINE_A_BAGMAKER";
const loading = ref(false);
const hasData = ref(false);
const bagmakerData = ref({
    targetBags: 0,
    actualBags: 0,
    goodBags: 0,
    notGoodBags: 0,
    totalEfficiency: 0,
    efficiencyWeigher: 0,
    efficiencyBagMaker: 0,
    metalDetect: 0,
    printerError: 0,
    productInSeal: 0,
    spliceDetect: 0,
    actualSpeed: 0,
    wastedFilmPercentage: 0,
});
const shiftSummary = ref({
    shift1: { target: 0, actual: 0, defect: 0, efficiency: 0 },
    shift2: { target: 0, actual: 0, defect: 0, efficiency: 0 },
    shift3: { target: 0, actual: 0, defect: 0, efficiency: 0 },
});
const status = computed(() => (hasData.value ? "running" : "offline"));
const fetchBagMakerData = async () => {
    loading.value = true;
    try {
        const response = await fetch(`http://localhost:2000/api/packing/bagmaker/${lineId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
            hasData.value = true;
            bagmakerData.value = {
                targetBags: result.data.targetBags || 0,
                actualBags: result.data.actualBags || 0,
                goodBags: result.data.goodBags || 0,
                notGoodBags: result.data.notGoodBags || 0,
                totalEfficiency: result.data.totalEfficiency || 0,
                efficiencyWeigher: result.data.efficiencyWeigher || 0,
                efficiencyBagMaker: result.data.efficiencyBagMaker || 0,
                metalDetect: result.data.metalDetect || 0,
                printerError: result.data.printerError || 0,
                productInSeal: result.data.productInSeal || 0,
                spliceDetect: result.data.spliceDetect || 0,
                actualSpeed: result.data.actualSpeed || 0,
                wastedFilmPercentage: result.data.wastedFilmPercentage || 0,
            };
            if (result.data.shifts) {
                result.data.shifts.forEach((shift) => {
                    const shiftKey = `shift${shift.shiftNumber}`;
                    if (shiftSummary.value[shiftKey]) {
                        shiftSummary.value[shiftKey] = {
                            target: shift.target || 0,
                            actual: shift.actual || 0,
                            defect: shift.defect || 0,
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
        console.error("Error fetching bagmaker data:", err);
        hasData.value = false;
    }
    finally {
        loading.value = false;
    }
};
onMounted(() => {
    fetchBagMakerData();
    setInterval(fetchBagMakerData, 30000);
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
/** @type {__VLS_StyleScopedClasses['metric-card-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card-large']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-percentage']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-percentage']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-card']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-bar-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-bar-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-bar-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-marker']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-marker']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-marker']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-marker']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-excellent']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-value']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-acceptable']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-value']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-high']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-value']} */ ;
/** @type {__VLS_StyleScopedClasses['excellent']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['acceptable']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['high']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-row']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-val']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-val']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-val']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['content-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['header-section']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-grid-2x2']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon-large']} */ ;
/** @type {__VLS_StyleScopedClasses['content-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['header-section']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-grid-2x2']} */ ;
/** @type {__VLS_StyleScopedClasses['quality-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon-large']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-display']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-number']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-bar-container']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-label']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-header']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-card']} */ ;
/** @type {__VLS_StyleScopedClasses['quality-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-cards']} */ ;
/** @type {__VLS_StyleScopedClasses['content-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['header-section']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card-large']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-monitor']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-item']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "bagmaker-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "bagmaker-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "icon-circle" },
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
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "status-dot" },
});
(__VLS_ctx.status.toUpperCase());
// @ts-ignore
[status,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "report-section" },
});
/** @type {[typeof ReportButton, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ReportButton, new ReportButton({
    routeName: "dailyReportBagmakerA",
    label: "View Daily Report",
}));
const __VLS_1 = __VLS_0({
    routeName: "dailyReportBagmakerA",
    label: "View Daily Report",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metrics-dashboard" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-heading" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "heading-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metrics-grid-2x2" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-card-large primary" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-icon-large" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-value-large" },
});
(__VLS_ctx.bagmakerData.targetBags.toLocaleString());
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-unit-large" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-card-large success" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-icon-large" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-value-large" },
});
(__VLS_ctx.bagmakerData.actualBags.toLocaleString());
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-unit-large" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-card-large accent" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-icon-large" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-value-large" },
});
(__VLS_ctx.bagmakerData.totalEfficiency);
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-progress-large" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-fill-large" },
    ...{ style: ({ width: __VLS_ctx.bagmakerData.totalEfficiency + '%' }) },
});
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-card-large info" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-icon-large" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-value-large" },
});
(__VLS_ctx.bagmakerData.actualSpeed);
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metric-unit-large" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-dashboard" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-heading" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "heading-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-cards" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "label-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-display" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-number" },
});
(__VLS_ctx.bagmakerData.efficiencyWeigher);
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-bar-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-bar weigher-bar" },
    ...{ style: ({ width: __VLS_ctx.bagmakerData.efficiencyWeigher + '%' }) },
});
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "bar-label" },
});
(__VLS_ctx.bagmakerData.efficiencyWeigher);
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "label-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-display" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-number" },
});
(__VLS_ctx.bagmakerData.efficiencyBagMaker);
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-bar-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "efficiency-bar bagmaker-bar" },
    ...{ style: ({ width: __VLS_ctx.bagmakerData.efficiencyBagMaker + '%' }) },
});
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "bar-label" },
});
(__VLS_ctx.bagmakerData.efficiencyBagMaker);
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "quality-dashboard" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-heading" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "heading-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "quality-summary" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "quality-stat good-stat" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
(__VLS_ctx.bagmakerData.goodBags.toLocaleString());
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-percentage success" },
});
(__VLS_ctx.bagmakerData.goodBags + __VLS_ctx.bagmakerData.notGoodBags > 0
    ? ((__VLS_ctx.bagmakerData.goodBags /
        (__VLS_ctx.bagmakerData.goodBags +
            __VLS_ctx.bagmakerData.notGoodBags)) *
        100).toFixed(1)
    : 0);
// @ts-ignore
[bagmakerData, bagmakerData, bagmakerData, bagmakerData, bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "quality-stat bad-stat" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
(__VLS_ctx.bagmakerData.notGoodBags.toLocaleString());
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-percentage danger" },
});
(__VLS_ctx.bagmakerData.goodBags + __VLS_ctx.bagmakerData.notGoodBags > 0
    ? ((__VLS_ctx.bagmakerData.notGoodBags /
        (__VLS_ctx.bagmakerData.goodBags +
            __VLS_ctx.bagmakerData.notGoodBags)) *
        100).toFixed(1)
    : 0);
// @ts-ignore
[bagmakerData, bagmakerData, bagmakerData, bagmakerData, bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-value" },
});
(__VLS_ctx.bagmakerData.metalDetect);
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-status" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-value" },
});
(__VLS_ctx.bagmakerData.printerError);
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-status" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-value" },
});
(__VLS_ctx.bagmakerData.productInSeal);
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-status" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-value" },
});
(__VLS_ctx.bagmakerData.spliceDetect);
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "detection-status" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "waste-dashboard" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-heading" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "heading-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "waste-monitor" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "waste-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "waste-icon-large" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "waste-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "waste-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "waste-percentage" },
});
(__VLS_ctx.bagmakerData.wastedFilmPercentage);
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "waste-badge" },
    ...{ class: ({
            excellent: __VLS_ctx.bagmakerData.wastedFilmPercentage < 2,
            acceptable: __VLS_ctx.bagmakerData.wastedFilmPercentage >= 2 &&
                __VLS_ctx.bagmakerData.wastedFilmPercentage < 5,
            high: __VLS_ctx.bagmakerData.wastedFilmPercentage >= 5,
        }) },
});
// @ts-ignore
[bagmakerData, bagmakerData, bagmakerData, bagmakerData,];
if (__VLS_ctx.bagmakerData.wastedFilmPercentage < 2) {
    // @ts-ignore
    [bagmakerData,];
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
else if (__VLS_ctx.bagmakerData.wastedFilmPercentage < 5) {
    // @ts-ignore
    [bagmakerData,];
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "waste-bar-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "waste-bar-fill" },
    ...{ class: ({
            'fill-excellent': __VLS_ctx.bagmakerData.wastedFilmPercentage < 2,
            'fill-acceptable': __VLS_ctx.bagmakerData.wastedFilmPercentage >= 2 &&
                __VLS_ctx.bagmakerData.wastedFilmPercentage < 5,
            'fill-high': __VLS_ctx.bagmakerData.wastedFilmPercentage >= 5,
        }) },
    ...{ style: ({
            width: Math.max(Math.min(__VLS_ctx.bagmakerData.wastedFilmPercentage, 100), 2) + '%',
        }) },
});
// @ts-ignore
[bagmakerData, bagmakerData, bagmakerData, bagmakerData, bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "waste-marker" },
    ...{ class: ({
            'marker-excellent': __VLS_ctx.bagmakerData.wastedFilmPercentage < 2,
            'marker-acceptable': __VLS_ctx.bagmakerData.wastedFilmPercentage >= 2 &&
                __VLS_ctx.bagmakerData.wastedFilmPercentage < 5,
            'marker-high': __VLS_ctx.bagmakerData.wastedFilmPercentage >= 5,
        }) },
    ...{ style: ({
            left: Math.min(__VLS_ctx.bagmakerData.wastedFilmPercentage, 100) + '%',
        }) },
});
// @ts-ignore
[bagmakerData, bagmakerData, bagmakerData, bagmakerData, bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "marker-value" },
});
(__VLS_ctx.bagmakerData.wastedFilmPercentage.toFixed(1));
// @ts-ignore
[bagmakerData,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "waste-indicators" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "indicator excellent" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "indicator acceptable" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "indicator high" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "shift-dashboard" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-heading" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "heading-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "shift-cards" },
});
for (const [data, shift, index] of __VLS_getVForSourceType((__VLS_ctx.shiftSummary))) {
    // @ts-ignore
    [shiftSummary,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (shift),
        ...{ class: "shift-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-badge" },
    });
    (index + 1);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-metrics" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-key" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-val" },
    });
    (data.target.toLocaleString());
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-key" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-val primary" },
    });
    (data.actual.toLocaleString());
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-key" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-val danger" },
    });
    (data.defect);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "shift-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-key" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shift-val success" },
    });
    (data.efficiency);
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "status-footer" },
});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "status-message loading" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "spinner" },
    });
}
else if (!__VLS_ctx.hasData) {
    // @ts-ignore
    [hasData,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "status-message waiting" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "icon" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "status-message connected" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "icon" },
    });
}
/** @type {__VLS_StyleScopedClasses['bagmaker-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['bagmaker-container']} */ ;
/** @type {__VLS_StyleScopedClasses['header-section']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['content-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['report-section']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['heading-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-grid-2x2']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card-large']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-label']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-unit-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card-large']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-label']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-unit-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card-large']} */ ;
/** @type {__VLS_StyleScopedClasses['accent']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-label']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-progress-large']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card-large']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-label']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value-large']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-unit-large']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['heading-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-cards']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-item']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-label']} */ ;
/** @type {__VLS_StyleScopedClasses['label-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-display']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-number']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-bar-container']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['weigher-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-label']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-item']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-label']} */ ;
/** @type {__VLS_StyleScopedClasses['label-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-display']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-number']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-bar-container']} */ ;
/** @type {__VLS_StyleScopedClasses['efficiency-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['bagmaker-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-label']} */ ;
/** @type {__VLS_StyleScopedClasses['quality-dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['heading-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['quality-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['quality-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['good-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-content']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-percentage']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['quality-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['bad-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-content']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-percentage']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-card']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-label']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-value']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-status']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-card']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-label']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-value']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-status']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-card']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-label']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-value']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-status']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-card']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-label']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-value']} */ ;
/** @type {__VLS_StyleScopedClasses['detection-status']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['heading-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-monitor']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-header']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-icon-large']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-info']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-title']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-percentage']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['excellent']} */ ;
/** @type {__VLS_StyleScopedClasses['acceptable']} */ ;
/** @type {__VLS_StyleScopedClasses['high']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-bar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-bar-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-excellent']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-acceptable']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-high']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-marker']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-excellent']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-acceptable']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-high']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-value']} */ ;
/** @type {__VLS_StyleScopedClasses['waste-indicators']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['excellent']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['acceptable']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['high']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['heading-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-cards']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-item']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-metrics']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-row']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-key']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-val']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-row']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-key']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-val']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-row']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-key']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-val']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-row']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-key']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-val']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['status-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['waiting']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['connected']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
