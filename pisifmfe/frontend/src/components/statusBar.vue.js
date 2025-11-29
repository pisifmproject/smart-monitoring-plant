import { computed } from "vue";
const props = withDefaults(defineProps(), {
    text: "",
    lastUpdate: null,
});
const ui = computed(() => {
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {
    text: "",
    lastUpdate: null,
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "rounded-2xl p-[1px] bg-gradient-to-br from-white/50 via-white/20 to-white/0 shadow-[0_4px_12px_rgba(0,0,0,0.1)]" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: ([
            'rounded-2xl ring-1 px-4 py-3 md:px-5 md:py-3.5',
            'bg-gradient-to-r backdrop-blur-sm flex items-center gap-3 md:gap-4',
            __VLS_ctx.ui.bg,
            __VLS_ctx.ui.ring,
        ]) },
});
// @ts-ignore
[ui, ui,];
__VLS_asFunctionalElement(__VLS_intrinsics.span)({
    ...{ class: (['h-2.5 w-2.5 rounded-full md:h-3 md:w-3', __VLS_ctx.ui.dot]) },
});
// @ts-ignore
[ui,];
__VLS_asFunctionalElement(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    ...{ class: "size-5 md:size-6" },
    viewBox: "0 0 24 24",
    fill: "none",
    ...{ class: (__VLS_ctx.ui.iconStroke) },
});
// @ts-ignore
[ui,];
__VLS_asFunctionalElement(__VLS_intrinsics.path)({
    d: "M3 12h3l2 4 4-8 2 4h5",
    'stroke-width': "1.8",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-col md:flex-row md:items-baseline md:gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: ([
            'text-sm md:text-base font-semibold tracking-wide',
            __VLS_ctx.ui.textMain,
        ]) },
});
// @ts-ignore
[ui,];
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "font-extrabold" },
});
(__VLS_ctx.ui.label);
// @ts-ignore
[ui,];
if (__VLS_ctx.text) {
    // @ts-ignore
    [text,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: (['text-xs md:text-sm', __VLS_ctx.ui.textSub]) },
    });
    // @ts-ignore
    [ui,];
    (__VLS_ctx.text);
    // @ts-ignore
    [text,];
}
if (__VLS_ctx.lastUpdate) {
    // @ts-ignore
    [lastUpdate,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: (['text-xs md:text-sm', __VLS_ctx.ui.textSub]) },
    });
    // @ts-ignore
    [ui,];
    (new Date(__VLS_ctx.lastUpdate).toLocaleString());
    // @ts-ignore
    [lastUpdate,];
}
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-[1px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['via-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['to-white/0']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-[0_4px_12px_rgba(0,0,0,0.1)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:py-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['size-5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:size-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['md:items-baseline']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wide']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
    props: {},
});
export default {};
