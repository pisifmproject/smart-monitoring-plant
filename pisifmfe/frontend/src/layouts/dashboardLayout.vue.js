import { ref, watchEffect, computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import SideBar from "@/components/sideBar.vue";
const route = useRoute();
// kontrol buka/tutup sidebar
const isSidebarOpen = ref(true);
// dropdown LVMDP
const openLvmdp = ref(true);
// auto-buka grup LVMDP kalau lagi di route lvmdp*
watchEffect(() => {
    const name = String(route.name || "");
    if (name.startsWith("lvmdp")) {
        openLvmdp.value = true;
    }
});
// daftar menu LVMDP
const lvmdpMenus = [
    { name: "LVMDP 1", routeName: "lvmdp1" },
    { name: "LVMDP 2", routeName: "lvmdp2" },
    { name: "LVMDP 3", routeName: "lvmdp3" },
    { name: "LVMDP 4", routeName: "lvmdp4" },
];
// Compute current page name dari route
const currentPageName = computed(() => {
    const routeName = String(route.name || "");
    const menu = lvmdpMenus.find((m) => m.routeName === routeName);
    return menu?.name || "Dashboard";
});
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['layout']} */ ;
/** @type {__VLS_StyleScopedClasses['group-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['chev']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['hamb']} */ ;
/** @type {__VLS_StyleScopedClasses['hamb']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['layout']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-visible']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['hamb']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "layout" },
});
/** @type {[typeof SideBar, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(SideBar, new SideBar({
    ...{ class: ({
            'sidebar-visible': __VLS_ctx.isSidebarOpen,
            'sidebar-hidden': !__VLS_ctx.isSidebarOpen,
        }) },
}));
const __VLS_1 = __VLS_0({
    ...{ class: ({
            'sidebar-visible': __VLS_ctx.isSidebarOpen,
            'sidebar-hidden': !__VLS_ctx.isSidebarOpen,
        }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
// @ts-ignore
[isSidebarOpen, isSidebarOpen,];
if (__VLS_ctx.isSidebarOpen) {
    // @ts-ignore
    [isSidebarOpen,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.isSidebarOpen))
                    return;
                __VLS_ctx.isSidebarOpen = false;
                // @ts-ignore
                [isSidebarOpen,];
            } },
        ...{ class: "backdrop lg:hidden" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "main" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "topbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.toggleSidebar) },
    ...{ class: "hamb" },
    type: "button",
    'aria-label': "Toggle sidebar",
});
// @ts-ignore
[toggleSidebar,];
__VLS_asFunctionalElement(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    ...{ class: "h-6 w-6" },
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
});
__VLS_asFunctionalElement(__VLS_intrinsics.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    'stroke-width': "2",
    d: "M4 6h16M4 12h16M4 18h16",
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "breadcrumb" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "breadcrumb-item" },
});
if (__VLS_ctx.currentPageName !== 'Dashboard') {
    // @ts-ignore
    [currentPageName,];
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "breadcrumb-sep" },
    });
}
if (__VLS_ctx.currentPageName !== 'Dashboard') {
    // @ts-ignore
    [currentPageName,];
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "breadcrumb-item active" },
    });
    (__VLS_ctx.currentPageName);
    // @ts-ignore
    [currentPageName,];
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "badge" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "page" },
    ...{ class: ({ 'sidebar-closed-state': !__VLS_ctx.isSidebarOpen }) },
});
// @ts-ignore
[isSidebarOpen,];
const __VLS_4 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, ]} */ ;
// @ts-ignore
RouterView;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
/** @type {__VLS_StyleScopedClasses['layout']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-visible']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['hamb']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-item']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-sep']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-closed-state']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
