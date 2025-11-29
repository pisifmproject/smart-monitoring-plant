import { ref, watchEffect } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { Cog, Zap, Factory, Package, BriefcaseConveyorBelt, CircleSmall, } from "lucide-vue-next";
const route = useRoute();
// State untuk setiap menu utama
const openMenus = ref({
    utility: false,
    lvmdp: false,
    // Siap untuk menu tambahan:
    production: false,
    packing: false,
});
const showText = ref(true);
// Auto-buka dropdown ketika berada di route terkait
watchEffect(() => {
    const routeName = String(route.name || "");
    const routePath = String(route.path || "");
    // Buka Utility > Electrical jika di lvmdp* atau daily-report
    if (routeName.startsWith("lvmdp") || routePath.includes("daily-report")) {
        openMenus.value.utility = true;
        openMenus.value.lvmdp = true;
    }
    // Buka Production jika di route production
    if (routeName === "pc39" ||
        routeName === "pc14" ||
        routeName === "ts1000" ||
        routeName === "fcp" ||
        routeName === "tws56" ||
        routeName === "tws72" ||
        routeName === "copack" ||
        routeName === "ihp" ||
        routePath.includes("daily-report/production")) {
        openMenus.value.production = true;
    }
    // Buka Packing jika di route packing
    if (routePath.includes("weigher") ||
        routePath.includes("bagmaker") ||
        routePath.includes("daily-report/weigher") ||
        routePath.includes("daily-report/bagmaker")) {
        openMenus.value.packing = true;
    }
});
// Menu struktur (nested, mudah di-extend)
const mainMenus = [
    {
        id: "utility",
        name: "Utility",
        icon: Cog,
        children: [
            {
                id: "lvmdp",
                name: "Electrical",
                icon: Zap,
                children: [
                    { id: "lvmdp1", name: "LVMDP 1", routeName: "lvmdp1" },
                    { id: "lvmdp2", name: "LVMDP 2", routeName: "lvmdp2" },
                    { id: "lvmdp3", name: "LVMDP 3", routeName: "lvmdp3" },
                    { id: "lvmdp4", name: "LVMDP 4", routeName: "lvmdp4" },
                ],
            },
        ],
    },
    {
        id: "production",
        name: "Production",
        icon: Factory,
        children: [
            { id: "pc39", name: "PC39", routeName: "pc39", icon: CircleSmall },
            { id: "pc14", name: "PC14", routeName: "pc14", icon: CircleSmall },
            { id: "ts1000", name: "TS1000", routeName: "ts1000", icon: CircleSmall },
            { id: "fcp", name: "FCP", routeName: "fcp", icon: CircleSmall },
            { id: "tws56", name: "TWS56", routeName: "tws56", icon: CircleSmall },
            { id: "tws72", name: "TWS72", routeName: "tws72", icon: CircleSmall },
            { id: "copack", name: "COPACK", routeName: "copack", icon: CircleSmall },
            { id: "ihp", name: "IHP", routeName: "ihp", icon: CircleSmall },
        ],
    },
    {
        id: "packing",
        name: "Packing",
        icon: Package,
        children: [
            {
                id: "packLineA",
                name: "Line A",
                icon: BriefcaseConveyorBelt,
                children: [
                    {
                        id: "weigherA",
                        name: "Weigher",
                        routeName: "weigherA",
                        icon: CircleSmall,
                    },
                    {
                        id: "bagmakerA",
                        name: "BagMaker",
                        routeName: "bagmakerA",
                        icon: CircleSmall,
                    },
                ],
            },
            {
                id: "packLineB",
                name: "Line B",
                icon: BriefcaseConveyorBelt,
                children: [
                    {
                        id: "weigherB",
                        name: "Weigher",
                        routeName: "weigherB",
                        icon: CircleSmall,
                    },
                    {
                        id: "bagmakerB",
                        name: "BagMaker",
                        routeName: "bagmakerB",
                        icon: CircleSmall,
                    },
                ],
            },
            {
                id: "packLineC",
                name: "Line C",
                icon: BriefcaseConveyorBelt,
                children: [
                    {
                        id: "weigherC",
                        name: "Weigher",
                        routeName: "weigherC",
                        icon: CircleSmall,
                    },
                    {
                        id: "bagmakerC",
                        name: "BagMaker",
                        routeName: "bagmakerC",
                        icon: CircleSmall,
                    },
                ],
            },
            {
                id: "packLineD",
                name: "Line D",
                icon: BriefcaseConveyorBelt,
                children: [
                    {
                        id: "weigherD",
                        name: "Weigher",
                        routeName: "weigherD",
                        icon: CircleSmall,
                    },
                    {
                        id: "bagmakerD",
                        name: "BagMaker",
                        routeName: "bagmakerD",
                        icon: CircleSmall,
                    },
                ],
            },
            {
                id: "packLineE",
                name: "Line E",
                icon: BriefcaseConveyorBelt,
                children: [
                    {
                        id: "weigherE",
                        name: "Weigher",
                        routeName: "weigherE",
                        icon: CircleSmall,
                    },
                    {
                        id: "bagmakerE",
                        name: "BagMaker",
                        routeName: "bagmakerE",
                        icon: CircleSmall,
                    },
                ],
            },
            // {
            //   id: "packLineF",
            //   name: "Line F",
            //   icon: BriefcaseConveyorBelt,
            //   children: [
            //     {
            //       id: "weigherF",
            //       name: "Weigher",
            //       routeName: "weigherF",
            //       icon: CircleSmall,
            //     },
            //     {
            //       id: "bagmakerF",
            //       name: "BagMaker",
            //       routeName: "bagmakerF",
            //       icon: CircleSmall,
            //     },
            //   ],
            // },
            {
                id: "packLineG",
                name: "Line G",
                icon: BriefcaseConveyorBelt,
                children: [
                    {
                        id: "weigherG",
                        name: "Weigher",
                        routeName: "weigherG",
                        icon: CircleSmall,
                    },
                    {
                        id: "bagmakerG",
                        name: "BagMaker",
                        routeName: "bagmakerG",
                        icon: CircleSmall,
                    },
                ],
            },
            {
                id: "packLineH",
                name: "Line H",
                icon: BriefcaseConveyorBelt,
                children: [
                    {
                        id: "weigherH",
                        name: "Weigher",
                        routeName: "weigherH",
                        icon: CircleSmall,
                    },
                    {
                        id: "bagmakerH",
                        name: "BagMaker",
                        routeName: "bagmakerH",
                        icon: CircleSmall,
                    },
                ],
            },
            {
                id: "packLineI",
                name: "Line I",
                icon: BriefcaseConveyorBelt,
                children: [
                    {
                        id: "weigherI",
                        name: "Weigher",
                        routeName: "weigherI",
                        icon: CircleSmall,
                    },
                    {
                        id: "bagmakerI",
                        name: "BagMaker",
                        routeName: "bagmakerI",
                        icon: CircleSmall,
                    },
                ],
            },
        ],
    },
];
function toggleMenu(menuId) {
    openMenus.value[menuId] = !openMenus.value[menuId];
}
function isMenuOpen(menuId) {
    return openMenus.value[menuId] ?? false;
}
// Check if a menu item should be marked as active
function isItemActive(routeName) {
    const currentRouteName = String(route.name || "");
    const currentRoutePath = String(route.path || "");
    // Direct match
    if (currentRouteName === routeName) {
        return true;
    }
    // Special case: LVMDP items should be active when in daily-report
    if (currentRoutePath.includes("daily-report") &&
        (routeName === "lvmdp1" ||
            routeName === "lvmdp2" ||
            routeName === "lvmdp3" ||
            routeName === "lvmdp4")) {
        // Check panel parameter from query
        const panelId = route.query.panel;
        if (panelId) {
            return routeName === `lvmdp${panelId}`;
        }
    }
    // Special case: Production items should be active when in production daily-report
    if (currentRoutePath.includes("daily-report/production") &&
        (routeName === "pc39" ||
            routeName === "pc14" ||
            routeName === "ts1000" ||
            routeName === "fcp" ||
            routeName === "tws56" ||
            routeName === "tws72" ||
            routeName === "copack" ||
            routeName === "ihp")) {
        // Extract production type from path
        const pathMatch = currentRoutePath.match(/production\/([^/?]+)/);
        if (pathMatch) {
            const prodType = pathMatch[1];
            return routeName === prodType;
        }
    }
    // Special case: Packing items (weigher/bagmaker) should be active in daily-report
    if (currentRoutePath.includes("daily-report/weigher")) {
        const lineMatch = currentRoutePath.match(/line-([a-i])/i);
        if (lineMatch) {
            const line = lineMatch[1].toUpperCase();
            return routeName === `weigher${line}`;
        }
    }
    if (currentRoutePath.includes("daily-report/bagmaker")) {
        const lineMatch = currentRoutePath.match(/line-([a-i])/i);
        if (lineMatch) {
            const line = lineMatch[1].toUpperCase();
            return routeName === `bagmaker${line}`;
        }
    }
    return false;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['group-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['group-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['group-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['level-2']} */ ;
/** @type {__VLS_StyleScopedClasses['chev']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu']} */ ;
/** @type {__VLS_StyleScopedClasses['level-2']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['level-2']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-title']} */ ;
/** @type {__VLS_StyleScopedClasses['menu']} */ ;
/** @type {__VLS_StyleScopedClasses['group-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['group-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['level-2']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu']} */ ;
/** @type {__VLS_StyleScopedClasses['level-1']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu']} */ ;
/** @type {__VLS_StyleScopedClasses['level-2']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['level-2']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['level-3']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
    ...{ class: "sidebar" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "sidebar-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement(__VLS_intrinsics.nav, __VLS_intrinsics.nav)({
    ...{ class: "menu" },
});
for (const [mainMenu] of __VLS_getVForSourceType((__VLS_ctx.mainMenus))) {
    (mainMenu.id);
    // @ts-ignore
    [mainMenus,];
    if (mainMenu.children) {
        __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(mainMenu.children))
                        return;
                    __VLS_ctx.toggleMenu(mainMenu.id);
                    // @ts-ignore
                    [toggleMenu,];
                } },
            ...{ class: "group-trigger" },
            'aria-expanded': (__VLS_ctx.isMenuOpen(mainMenu.id) ? 'true' : 'false'),
        });
        // @ts-ignore
        [isMenuOpen,];
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "flex items-center gap-2" },
        });
        if (mainMenu.icon) {
            const __VLS_0 = ((mainMenu.icon));
            // @ts-ignore
            const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
                ...{ class: "w-4 h-4" },
            }));
            const __VLS_2 = __VLS_1({
                ...{ class: "w-4 h-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        }
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (mainMenu.name);
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "chev" },
            ...{ class: ({ rot: __VLS_ctx.isMenuOpen(mainMenu.id) }) },
        });
        // @ts-ignore
        [isMenuOpen,];
    }
    const __VLS_5 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    Transition;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        name: "fade",
        persisted: true,
    }));
    const __VLS_7 = __VLS_6({
        name: "fade",
        persisted: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    const { default: __VLS_9 } = __VLS_8.slots;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "submenu level-1" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.isMenuOpen(mainMenu.id)) }, null, null);
    // @ts-ignore
    [isMenuOpen,];
    for (const [subMenu] of __VLS_getVForSourceType((mainMenu.children))) {
        (subMenu.id);
        if (subMenu.children) {
            __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(subMenu.children))
                            return;
                        __VLS_ctx.toggleMenu(subMenu.id);
                        // @ts-ignore
                        [toggleMenu,];
                    } },
                ...{ class: "group-trigger level-2" },
                'aria-expanded': (__VLS_ctx.isMenuOpen(subMenu.id) ? 'true' : 'false'),
            });
            // @ts-ignore
            [isMenuOpen,];
            __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "flex items-center gap-2" },
            });
            if (subMenu.icon) {
                const __VLS_10 = ((subMenu.icon));
                // @ts-ignore
                const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
                    ...{ class: "w-4 h-4" },
                }));
                const __VLS_12 = __VLS_11({
                    ...{ class: "w-4 h-4" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_11));
            }
            __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (subMenu.name);
            __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "chev" },
                ...{ class: ({ rot: __VLS_ctx.isMenuOpen(subMenu.id) }) },
            });
            // @ts-ignore
            [isMenuOpen,];
        }
        else if (subMenu.routeName) {
            const __VLS_15 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
            // @ts-ignore
            RouterLink;
            // @ts-ignore
            const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
                to: ({ name: subMenu.routeName }),
                ...{ class: "submenu-item level-2" },
                activeClass: "active",
            }));
            const __VLS_17 = __VLS_16({
                to: ({ name: subMenu.routeName }),
                ...{ class: "submenu-item level-2" },
                activeClass: "active",
            }, ...__VLS_functionalComponentArgsRest(__VLS_16));
            const { default: __VLS_19 } = __VLS_18.slots;
            __VLS_asFunctionalElement(__VLS_intrinsics.div)({
                ...{ class: "h-2.5 w-2.5 rounded-full bg-slate-600" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (subMenu.name);
            var __VLS_18;
        }
        const __VLS_20 = {}.transition;
        /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
        // @ts-ignore
        Transition;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            name: "fade",
            persisted: true,
        }));
        const __VLS_22 = __VLS_21({
            name: "fade",
            persisted: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        const { default: __VLS_24 } = __VLS_23.slots;
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "submenu level-2" },
        });
        __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (subMenu.children && __VLS_ctx.isMenuOpen(subMenu.id)) }, null, null);
        // @ts-ignore
        [isMenuOpen,];
        for (const [childMenu] of __VLS_getVForSourceType((subMenu.children))) {
            const __VLS_25 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
            // @ts-ignore
            RouterLink;
            // @ts-ignore
            const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
                key: (childMenu.id),
                to: ({ name: childMenu.routeName }),
                ...{ class: "submenu-item level-3" },
                ...{ class: ({ active: __VLS_ctx.isItemActive(childMenu.routeName) }) },
            }));
            const __VLS_27 = __VLS_26({
                key: (childMenu.id),
                to: ({ name: childMenu.routeName }),
                ...{ class: "submenu-item level-3" },
                ...{ class: ({ active: __VLS_ctx.isItemActive(childMenu.routeName) }) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_26));
            const { default: __VLS_29 } = __VLS_28.slots;
            // @ts-ignore
            [isItemActive,];
            __VLS_asFunctionalElement(__VLS_intrinsics.div)({
                ...{ class: "h-2.5 w-2.5 rounded-full bg-slate-600" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (childMenu.name);
            var __VLS_28;
        }
        var __VLS_23;
    }
    var __VLS_8;
}
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-title']} */ ;
/** @type {__VLS_StyleScopedClasses['menu']} */ ;
/** @type {__VLS_StyleScopedClasses['group-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['chev']} */ ;
/** @type {__VLS_StyleScopedClasses['rot']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu']} */ ;
/** @type {__VLS_StyleScopedClasses['level-1']} */ ;
/** @type {__VLS_StyleScopedClasses['group-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['level-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['chev']} */ ;
/** @type {__VLS_StyleScopedClasses['rot']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['level-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu']} */ ;
/** @type {__VLS_StyleScopedClasses['level-2']} */ ;
/** @type {__VLS_StyleScopedClasses['submenu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['level-3']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-600']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
