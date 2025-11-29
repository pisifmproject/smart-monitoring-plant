import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
// Modal states
const showPasswordModal = ref(false);
const password = ref("");
const errorMsg = ref("");
// buka modal ketika tombol MASUK diklik
function openPasswordModal() {
    showPasswordModal.value = true;
    password.value = "";
    errorMsg.value = "";
}
// tutup modal
function closePasswordModal() {
    showPasswordModal.value = false;
}
// cek password
function submitPassword() {
    if (password.value === "pisifm00") {
        showPasswordModal.value = false;
        router.push("/app/lvmdp1"); // arahkan seperti sebelumnya
    }
    else {
        errorMsg.value = "Eitsss...Password salah!!!";
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['pw-input']} */ ;
/** @type {__VLS_StyleScopedClasses['pw-btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['pw-btn-secondary']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "pointer-events-none absolute inset-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div)({
    ...{ class: "absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-cyan-500/40 to-sky-400/40 blur-3xl animate-float-slow" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div)({
    ...{ class: "absolute -bottom-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-indigo-500/30 to-fuchsia-400/30 blur-3xl animate-float-rev" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div)({
    ...{ class: "absolute top-1/2 left-1/2 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-cyan-400/20 to-transparent blur-3xl animate-pulse" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div)({
    ...{ class: "pointer-events-none absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:24px_24px]" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "relative z-10 flex flex-col min-h-screen" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-1 flex items-center justify-center px-4 py-20 md:py-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "max-w-4xl w-full text-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-8 flex justify-center animate-fade-in" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div)({
    ...{ class: "absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-20" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-5xl md:text-7xl font-bold leading-tight mb-4 animate-fade-in-delayed-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "block mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.br)({});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-lg md:text-2xl font-medium text-slate-300 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto animate-fade-in-delayed-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-delayed-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.openPasswordModal) },
    ...{ class: "group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-500/60 hover:scale-105" },
});
// @ts-ignore
[openPasswordModal,];
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    ...{ class: "size-5 transition group-hover:translate-x-1" },
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
});
__VLS_asFunctionalElement(__VLS_intrinsics.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    'stroke-width': "2",
    d: "m9 5 7 7-7 7",
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "relative z-10 border-t border-slate-700/50 py-12 text-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-sm text-slate-400 mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-xs text-slate-500" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({
    ...{ class: "text-slate-300" },
});
if (__VLS_ctx.showPasswordModal) {
    // @ts-ignore
    [showPasswordModal,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.closePasswordModal) },
        ...{ class: "pw-backdrop" },
    });
    // @ts-ignore
    [closePasswordModal,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
        ...{ class: "pw-modal" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
        ...{ class: "pw-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.input)({
        ...{ onKeyup: (__VLS_ctx.submitPassword) },
        type: "password",
        ...{ class: "pw-input" },
        placeholder: "Password",
    });
    (__VLS_ctx.password);
    // @ts-ignore
    [submitPassword, password,];
    if (__VLS_ctx.errorMsg) {
        // @ts-ignore
        [errorMsg,];
        __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "pw-error" },
        });
        (__VLS_ctx.errorMsg);
        // @ts-ignore
        [errorMsg,];
    }
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "pw-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.closePasswordModal) },
        ...{ class: "pw-btn pw-btn-secondary" },
    });
    // @ts-ignore
    [closePasswordModal,];
    __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.submitPassword) },
        ...{ class: "pw-btn pw-btn-primary" },
    });
    // @ts-ignore
    [submitPassword,];
}
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-b']} */ ;
/** @type {__VLS_StyleScopedClasses['from-slate-950']} */ ;
/** @type {__VLS_StyleScopedClasses['via-slate-950']} */ ;
/** @type {__VLS_StyleScopedClasses['to-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-top-40']} */ ;
/** @type {__VLS_StyleScopedClasses['-left-40']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[36rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[36rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-tr']} */ ;
/** @type {__VLS_StyleScopedClasses['from-cyan-500/40']} */ ;
/** @type {__VLS_StyleScopedClasses['to-sky-400/40']} */ ;
/** @type {__VLS_StyleScopedClasses['blur-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-float-slow']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-bottom-40']} */ ;
/** @type {__VLS_StyleScopedClasses['-right-40']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[36rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[36rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-tr']} */ ;
/** @type {__VLS_StyleScopedClasses['from-indigo-500/30']} */ ;
/** @type {__VLS_StyleScopedClasses['to-fuchsia-400/30']} */ ;
/** @type {__VLS_StyleScopedClasses['blur-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-float-rev']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['left-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[30rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[30rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-cyan-400/20']} */ ;
/** @type {__VLS_StyleScopedClasses['to-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['blur-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-[0.05]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)]']} */ ;
/** @type {__VLS_StyleScopedClasses['[background-size:24px_24px]']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-20']} */ ;
/** @type {__VLS_StyleScopedClasses['md:py-0']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['to-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['blur-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in-delayed-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['via-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-indigo-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in-delayed-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in-delayed-3']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['to-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-950']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-cyan-500/40']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-cyan-500/60']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['size-5']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:translate-x-1']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-700/50']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['pw-backdrop']} */ ;
/** @type {__VLS_StyleScopedClasses['pw-modal']} */ ;
/** @type {__VLS_StyleScopedClasses['pw-title']} */ ;
/** @type {__VLS_StyleScopedClasses['pw-input']} */ ;
/** @type {__VLS_StyleScopedClasses['pw-error']} */ ;
/** @type {__VLS_StyleScopedClasses['pw-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['pw-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pw-btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['pw-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pw-btn-primary']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
