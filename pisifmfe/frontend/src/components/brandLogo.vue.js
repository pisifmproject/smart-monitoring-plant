import { computed, ref } from "vue";
const props = withDefaults(defineProps(), {
    src: "/Logo.jpg",
    size: 44,
    max: 96,
    mode: "box", // default masih kotak
    rounded: true,
    glow: true,
    alt: "Brand logo",
    fit: "cover",
});
const toCssSize = (v) => typeof v === "number" ? `${v}px` : v;
const boxSize = computed(() => toCssSize(props.size));
const maxSize = computed(() => toCssSize(props.max));
// base path aman
const base = (import.meta.env.BASE_URL ?? "/");
const joinPath = (b, p) => {
    const bb = b.endsWith("/") ? b.slice(0, -1) : b;
    const pp = p.startsWith("/") ? p : `/${p}`;
    return `${bb}${pp}`;
};
const hasError = ref(false);
const resolvedSrc = computed(() => {
    if (hasError.value || !props.src)
        return "";
    if (/^https?:\/\//i.test(props.src))
        return props.src;
    if (props.src.startsWith("/"))
        return joinPath(base, props.src);
    return props.src;
});
const onErr = () => { hasError.value = true; };
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {
    src: "/Logo.jpg",
    size: 44,
    max: 96,
    mode: "box", // default masih kotak
    rounded: true,
    glow: true,
    alt: "Brand logo",
    fit: "cover",
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.mode === 'box') {
    // @ts-ignore
    [mode,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "inline-flex items-center justify-center" },
        ...{ style: ({ width: __VLS_ctx.boxSize, height: __VLS_ctx.boxSize }) },
    });
    // @ts-ignore
    [boxSize, boxSize,];
    if (__VLS_ctx.resolvedSrc) {
        // @ts-ignore
        [resolvedSrc,];
        __VLS_asFunctionalElement(__VLS_intrinsics.img)({
            ...{ onError: (__VLS_ctx.onErr) },
            src: (__VLS_ctx.resolvedSrc),
            alt: (__VLS_ctx.alt),
            ...{ class: ([
                    __VLS_ctx.fit === 'contain' ? 'object-contain' : 'object-cover',
                    __VLS_ctx.rounded ? 'rounded-xl' : '',
                    __VLS_ctx.glow ? 'shadow-lg shadow-cyan-500/20' : ''
                ]) },
            ...{ style: ({ width: '100%', height: '100%' }) },
            draggable: "false",
        });
        // @ts-ignore
        [resolvedSrc, onErr, alt, fit, rounded, glow,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsics.div)({
            ...{ class: ([
                    'bg-gradient-to-br from-cyan-400 to-blue-600',
                    __VLS_ctx.rounded ? 'rounded-xl' : '',
                    __VLS_ctx.glow ? 'shadow-lg shadow-cyan-500/20' : ''
                ]) },
            ...{ style: ({ width: '100%', height: '100%' }) },
        });
        // @ts-ignore
        [rounded, glow,];
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "inline-flex items-center justify-center" },
    });
    if (__VLS_ctx.resolvedSrc) {
        // @ts-ignore
        [resolvedSrc,];
        __VLS_asFunctionalElement(__VLS_intrinsics.img)({
            ...{ onError: (__VLS_ctx.onErr) },
            src: (__VLS_ctx.resolvedSrc),
            alt: (__VLS_ctx.alt),
            ...{ class: ([
                    __VLS_ctx.rounded ? 'rounded-xl' : '',
                    __VLS_ctx.glow ? 'shadow-lg shadow-cyan-500/20' : ''
                ]) },
            ...{ style: ({
                    maxWidth: __VLS_ctx.maxSize,
                    maxHeight: __VLS_ctx.maxSize,
                    height: 'auto',
                    width: 'auto'
                }) },
            draggable: "false",
        });
        // @ts-ignore
        [resolvedSrc, onErr, alt, rounded, glow, maxSize, maxSize,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsics.div)({
            ...{ class: ([
                    'bg-gradient-to-br from-cyan-400 to-blue-600',
                    __VLS_ctx.rounded ? 'rounded-xl' : '',
                    __VLS_ctx.glow ? 'shadow-lg shadow-cyan-500/20' : ''
                ]) },
            ...{ style: ({ width: __VLS_ctx.maxSize, height: __VLS_ctx.maxSize }) },
        });
        // @ts-ignore
        [rounded, glow, maxSize, maxSize,];
    }
}
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-blue-600']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
    props: {},
});
export default {};
