import { useRouter } from "vue-router";
const props = defineProps();
const router = useRouter();
function openReport() {
    if (props.routeName) {
        router.push({ name: props.routeName });
    }
    else if (props.panelId) {
        router.push({
            name: "dailyReport",
            query: { panel: props.panelId },
        });
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['report-button']} */ ;
/** @type {__VLS_StyleScopedClasses['report-button']} */ ;
/** @type {__VLS_StyleScopedClasses['report-button']} */ ;
/** @type {__VLS_StyleScopedClasses['report-icon']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.openReport) },
    ...{ class: "report-button" },
});
// @ts-ignore
[openReport,];
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "report-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "report-text" },
});
(__VLS_ctx.label || "Daily Report");
// @ts-ignore
[label,];
/** @type {__VLS_StyleScopedClasses['report-button']} */ ;
/** @type {__VLS_StyleScopedClasses['report-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['report-text']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
