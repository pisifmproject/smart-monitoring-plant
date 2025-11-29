import ShiftCard from "@/components/shiftCard.vue";
import Gauge from "@/components/gaugeSimple.vue";
import StatusBar from "@/components/statusBar.vue";
import ReportButton from "@/components/reportButton.vue";
import { useLvmdpLive } from "@/composables/useLvmdpLive";
import { useShiftAverages } from "@/composables/useShiftAverage";
const { s1, s2, s3 } = useShiftAverages(2);
const { isConnected, power, freq, cosPhi } = useLvmdpLive(2);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['gauge-card']} */ ;
/** @type {__VLS_StyleScopedClasses['gauges-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-card']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gauges-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gauges-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-card']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gauges-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-card']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['lvmdp-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-card']} */ ;
/** @type {__VLS_StyleScopedClasses['content-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['performance-section']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-section']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-card']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "lvmdp-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "lvmdp-container" },
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
    ...{ class: "header-actions" },
});
/** @type {[typeof ReportButton, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ReportButton, new ReportButton({
    panelId: (2),
}));
const __VLS_1 = __VLS_0({
    panelId: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "performance-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "section-subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "shift-grid" },
});
/** @type {[typeof ShiftCard, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(ShiftCard, new ShiftCard({
    title: "SHIFT 1",
    kw: (__VLS_ctx.s1.avgPower),
    iavg: (__VLS_ctx.s1.avgCurrent),
}));
const __VLS_5 = __VLS_4({
    title: "SHIFT 1",
    kw: (__VLS_ctx.s1.avgPower),
    iavg: (__VLS_ctx.s1.avgCurrent),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
// @ts-ignore
[s1, s1,];
/** @type {[typeof ShiftCard, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(ShiftCard, new ShiftCard({
    title: "SHIFT 2",
    kw: (__VLS_ctx.s2.avgPower),
    iavg: (__VLS_ctx.s2.avgCurrent),
}));
const __VLS_9 = __VLS_8({
    title: "SHIFT 2",
    kw: (__VLS_ctx.s2.avgPower),
    iavg: (__VLS_ctx.s2.avgCurrent),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
// @ts-ignore
[s2, s2,];
/** @type {[typeof ShiftCard, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(ShiftCard, new ShiftCard({
    title: "SHIFT 3",
    kw: (__VLS_ctx.s3.avgPower),
    iavg: (__VLS_ctx.s3.avgCurrent),
}));
const __VLS_13 = __VLS_12({
    title: "SHIFT 3",
    kw: (__VLS_ctx.s3.avgPower),
    iavg: (__VLS_ctx.s3.avgCurrent),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
// @ts-ignore
[s3, s3,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "status-wrapper" },
});
/** @type {[typeof StatusBar, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(StatusBar, new StatusBar({
    connected: (__VLS_ctx.isConnected),
}));
const __VLS_17 = __VLS_16({
    connected: (__VLS_ctx.isConnected),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
// @ts-ignore
[isConnected,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metrics-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "section-subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "gauges-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "gauge-card" },
});
/** @type {[typeof Gauge, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(Gauge, new Gauge({
    title: "Active Power",
    value: (__VLS_ctx.power ?? 0),
    min: (0),
    max: (2000),
    unit: "kW",
}));
const __VLS_21 = __VLS_20({
    title: "Active Power",
    value: (__VLS_ctx.power ?? 0),
    min: (0),
    max: (2000),
    unit: "kW",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
// @ts-ignore
[power,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "gauge-card" },
});
/** @type {[typeof Gauge, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(Gauge, new Gauge({
    title: "Frequency",
    value: (__VLS_ctx.freq ?? 0),
    min: (0),
    max: (60),
    unit: "Hz",
}));
const __VLS_25 = __VLS_24({
    title: "Frequency",
    value: (__VLS_ctx.freq ?? 0),
    min: (0),
    max: (60),
    unit: "Hz",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
// @ts-ignore
[freq,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "gauge-card" },
});
/** @type {[typeof Gauge, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(Gauge, new Gauge({
    title: "Power Factor",
    value: (__VLS_ctx.cosPhi ?? 0),
    min: (0),
    max: (1),
    unit: "",
}));
const __VLS_29 = __VLS_28({
    title: "Power Factor",
    value: (__VLS_ctx.cosPhi ?? 0),
    min: (0),
    max: (1),
    unit: "",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
// @ts-ignore
[cosPhi,];
/** @type {__VLS_StyleScopedClasses['lvmdp-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['lvmdp-container']} */ ;
/** @type {__VLS_StyleScopedClasses['header-section']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['content-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['performance-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['section-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['status-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['section-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['gauges-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-card']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-card']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-card']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
