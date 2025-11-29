import { ref, onMounted, computed } from "vue";
import { getDailyReportAll } from "@/lib/api";
const props = defineProps();
const panelId = (props.panelId ?? 1);
const rows = ref([]);
const loading = ref(false);
const error = ref(null);
const numberFormatter = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
function safeFormatNumber(v) {
    if (v === null || v === undefined || v === "-")
        return "-";
    const n = Number(v);
    if (Number.isNaN(n))
        return String(v);
    return numberFormatter.format(n);
}
// function formatDateSafe(dateRaw: any) {
//   if (!dateRaw) return "-";
//   const t = Date.parse(dateRaw);
//   if (!Number.isNaN(t)) {
//     return new Date(t).toLocaleDateString("id-ID");
//   }
//   return String(dateRaw);
// }
function formatDateSafe(dateRaw) {
    if (!dateRaw)
        return "-";
    // Jika backend kirim Date object → jadikan string dulu
    const d = new Date(dateRaw);
    if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    }
    // fallback
    return String(dateRaw);
}
function fmtShift(s) {
    if (!s)
        return { kwh: "-", iavg: "-" };
    const kwh = s.avgTotalKwh ?? s.avgKwh ?? null;
    const iavg = s.avgCurrent ?? null;
    return {
        kwh: safeFormatNumber(kwh),
        iavg: safeFormatNumber(iavg),
    };
}
async function loadAll() {
    loading.value = true;
    error.value = null;
    try {
        const raw = (await getDailyReportAll(panelId));
        // Normalisasi: pakai reportDate → simpan ke field date
        const data = raw.map((r) => ({
            ...r,
            date: r.date ?? r.reportDate ?? r.tanggal ?? null,
        }));
        // sort by date desc
        rows.value = [...data].sort((a, b) => {
            const da = Date.parse(String(a.date ?? a.reportDate ?? "")) || 0;
            const db = Date.parse(String(b.date ?? b.reportDate ?? "")) || 0;
            return db - da;
        });
    }
    catch (err) {
        console.error("loadAll daily report error:", err);
        error.value =
            err?.response?.data?.message || err.message || "Gagal memuat laporan";
        rows.value = [];
    }
    finally {
        loading.value = false;
    }
}
onMounted(loadAll);
function extractShift(r, n) {
    return {
        avgKwh: r[`shift${n}AvgKwh`] ?? null,
        avgCurrent: r[`shift${n}AvgCurrent`] ?? null,
    };
}
const displayRows = computed(() => rows.value.map((r, idx) => {
    const sh1 = fmtShift(extractShift(r, 1));
    const sh2 = fmtShift(extractShift(r, 2));
    const sh3 = fmtShift(extractShift(r, 3));
    const dateSource = r.date ?? r.reportDate ?? null;
    return {
        no: idx + 1,
        dateKey: String(dateSource ?? idx),
        dateStr: formatDateSafe(dateSource),
        sh1,
        sh2,
        sh3,
    };
}));
function refresh() {
    loadAll();
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
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-8" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center justify-between mb-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
    ...{ class: "text-lg font-semibold text-slate-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.refresh) },
    ...{ class: "px-3 py-1 bg-white border rounded shadow text-sm" },
});
// @ts-ignore
[refresh,];
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "py-6 text-center text-slate-500" },
    });
}
else if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-red-600 mb-4" },
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
}
else if (!__VLS_ctx.displayRows.length) {
    // @ts-ignore
    [displayRows,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-sm text-slate-500" },
    });
}
if (__VLS_ctx.displayRows.length) {
    // @ts-ignore
    [displayRows,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "bg-white rounded-lg shadow-lg border" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "px-4 py-3 border-b bg-white flex items-center justify-between text-sm text-slate-600" },
    });
    (__VLS_ctx.displayRows.length);
    // @ts-ignore
    [displayRows,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "overflow-x-auto" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.table, __VLS_intrinsics.table)({
        ...{ class: "min-w-full divide-y table-auto" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.thead, __VLS_intrinsics.thead)({
        ...{ class: "bg-slate-50 sticky top-0" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({
        ...{ class: "th-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({
        ...{ class: "th-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({
        ...{ class: "th-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({
        ...{ class: "th-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({
        ...{ class: "th-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({
        ...{ class: "bg-white" },
    });
    for (const [r] of __VLS_getVForSourceType((__VLS_ctx.displayRows))) {
        // @ts-ignore
        [displayRows,];
        __VLS_asFunctionalElement(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
            key: (r.dateKey + '-' + r.no),
            ...{ class: "hover:bg-slate-50 odd:bg-slate-50" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            ...{ class: "td-cell" },
        });
        (r.no);
        __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            ...{ class: "td-cell" },
        });
        (r.dateStr);
        __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            ...{ class: "td-cell" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex gap-2 items-center" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "value" },
        });
        (r.sh1.kwh);
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "unit" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "sep" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "value" },
        });
        (r.sh1.iavg);
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "unit" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            ...{ class: "td-cell" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex gap-2 items-center" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "value" },
        });
        (r.sh2.kwh);
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "unit" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "sep" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "value" },
        });
        (r.sh2.iavg);
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "unit" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            ...{ class: "td-cell" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex gap-2 items-center" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "value" },
        });
        (r.sh3.kwh);
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "unit" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "sep" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "value" },
        });
        (r.sh3.iavg);
        __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "unit" },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-y']} */ ;
/** @type {__VLS_StyleScopedClasses['table-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-50']} */ ;
/** @type {__VLS_StyleScopedClasses['sticky']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['th-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['th-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['th-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['th-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['th-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-50']} */ ;
/** @type {__VLS_StyleScopedClasses['odd:bg-slate-50']} */ ;
/** @type {__VLS_StyleScopedClasses['td-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['td-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['td-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['unit']} */ ;
/** @type {__VLS_StyleScopedClasses['sep']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['unit']} */ ;
/** @type {__VLS_StyleScopedClasses['td-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['unit']} */ ;
/** @type {__VLS_StyleScopedClasses['sep']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['unit']} */ ;
/** @type {__VLS_StyleScopedClasses['td-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['unit']} */ ;
/** @type {__VLS_StyleScopedClasses['sep']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['unit']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
