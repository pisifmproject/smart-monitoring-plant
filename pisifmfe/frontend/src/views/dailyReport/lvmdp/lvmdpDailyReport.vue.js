import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { getDailyReportAll, getDailyHourly } from "@/lib/api";
import { Download, CalendarSearch, HardDriveUpload, ClockFading, FileChartColumn, } from "lucide-vue-next";
const route = useRoute();
const panelId = (parseInt(String(route.query.panel || 1)) || 1);
// Date picker
const selectedDate = ref(new Date().toISOString().split("T")[0]);
const minDate = ref("2024-01-01");
const maxDate = computed(() => new Date().toISOString().split("T")[0]);
const dateInput = ref(null);
function openDatePicker() {
    const el = dateInput.value;
    if (el?.showPicker)
        el.showPicker();
    else if (el)
        el.focus();
}
// Tab state
const activeTab = ref("shift");
// Data states
const shiftReports = ref([]);
const hourlyReports = ref([]);
const loadingShift = ref(false);
const loadingHourly = ref(false);
const errorShift = ref(null);
const errorHourly = ref(null);
// Debounce timer for date changes
let dateChangeTimer = null;
// Request tracking to prevent race conditions
let currentShiftRequest = 0;
let currentHourlyRequest = 0;
// Download dropdown state
const showDownloadMenu = ref(false);
const handleWindowClick = () => {
    showDownloadMenu.value = false;
};
function toggleDownloadMenu() {
    showDownloadMenu.value = !showDownloadMenu.value;
}
// Local storage cache
// v10: Enhanced race condition fix - clear old data immediately + strict validation
const cacheKey = (date) => `lvmdp_${panelId}_hourly_v10_${date}`;
const numberFormatter = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
function formatNumber(v) {
    if (v === null || v === undefined || v === "-")
        return "-";
    const n = Number(v);
    if (Number.isNaN(n))
        return "-";
    return numberFormatter.format(n);
}
function formatTime(dateStr) {
    try {
        const d = new Date(dateStr);
        return d.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    catch {
        return dateStr;
    }
}
function formatDate(dateStr) {
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("id-ID", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }
    catch {
        return dateStr;
    }
}
// Cache for shift reports to avoid repeated API calls
const shiftReportsCache = new Map();
// Fetch all daily reports for shift summaries
async function loadShiftReports() {
    loadingShift.value = true;
    errorShift.value = null;
    // Increment request counter to track this specific request
    const requestId = ++currentShiftRequest;
    const targetDate = selectedDate.value;
    try {
        // Check cache first
        const cacheKey = `shift_${panelId}_${targetDate}`;
        if (shiftReportsCache.has(cacheKey)) {
            // Still check if this is the latest request
            if (requestId !== currentShiftRequest)
                return;
            shiftReports.value = shiftReportsCache.get(cacheKey);
            loadingShift.value = false;
            return;
        }
        const data = await getDailyReportAll(panelId);
        // Check if this request is still valid (user hasn't changed date)
        if (requestId !== currentShiftRequest ||
            targetDate !== selectedDate.value) {
            return; // Discard stale response
        }
        if (Array.isArray(data)) {
            // Use find instead of filter for single result
            const report = data.find((row) => {
                const rowDate = row.date || row.reportDate;
                return rowDate === targetDate;
            });
            if (report) {
                const result = [
                    {
                        shift: 1,
                        totalKwh: report.shift1TotalKwh || 0,
                        avgKwh: report.shift1AvgKwh || 0,
                        iavg: report.shift1AvgCurrent || 0,
                        cosPhi: report.shift1CosPhi || 0,
                    },
                    {
                        shift: 2,
                        totalKwh: report.shift2TotalKwh || 0,
                        avgKwh: report.shift2AvgKwh || 0,
                        iavg: report.shift2AvgCurrent || 0,
                        cosPhi: report.shift2CosPhi || 0,
                    },
                    {
                        shift: 3,
                        totalKwh: report.shift3TotalKwh || 0,
                        avgKwh: report.shift3AvgKwh || 0,
                        iavg: report.shift3AvgCurrent || 0,
                        cosPhi: report.shift3CosPhi || 0,
                    },
                ];
                // Final check before updating - prevent race condition
                if (requestId !== currentShiftRequest ||
                    targetDate !== selectedDate.value) {
                    return;
                }
                shiftReports.value = result;
                shiftReportsCache.set(cacheKey, result);
            }
            else {
                const emptyResult = [
                    { shift: 1, totalKwh: 0, avgKwh: 0, iavg: 0, cosPhi: 0 },
                    { shift: 2, totalKwh: 0, avgKwh: 0, iavg: 0, cosPhi: 0 },
                    { shift: 3, totalKwh: 0, avgKwh: 0, iavg: 0, cosPhi: 0 },
                ];
                // Final check before updating
                if (requestId !== currentShiftRequest ||
                    targetDate !== selectedDate.value) {
                    return;
                }
                shiftReports.value = emptyResult;
                shiftReportsCache.set(cacheKey, emptyResult);
            }
        }
    }
    catch (err) {
        // Only set error if this is still the current request
        if (requestId === currentShiftRequest &&
            targetDate === selectedDate.value) {
            errorShift.value = String(err);
        }
    }
    finally {
        // Only clear loading if this is still the current request
        if (requestId === currentShiftRequest &&
            targetDate === selectedDate.value) {
            loadingShift.value = false;
        }
    }
}
// Fetch and cache hourly reports
async function loadHourlyReports() {
    loadingHourly.value = true;
    errorHourly.value = null;
    // Increment request counter to track this specific request
    const requestId = ++currentHourlyRequest;
    const targetDate = selectedDate.value;
    try {
        const cached = localStorage.getItem(cacheKey(targetDate));
        if (cached) {
            // Still check if this is the latest request
            if (requestId !== currentHourlyRequest)
                return;
            hourlyReports.value = JSON.parse(cached);
            loadingHourly.value = false;
            return;
        }
        const data = await getDailyHourly(panelId, targetDate);
        // Check if this request is still valid (user hasn't changed date)
        if (requestId !== currentHourlyRequest ||
            targetDate !== selectedDate.value) {
            return; // Discard stale response
        }
        if (Array.isArray(data)) {
            const normalized = data.map((row) => ({
                hour: row.hour,
                totalKwh: row.totalKwh ?? row.avg_total_kwh ?? row.total_kwh ?? 0,
                avgKwh: row.avgKwh ?? row.avg_kwh ?? 0,
                cosPhi: row.cosPhi ?? row.avg_cos_phi ?? row.cos_phi ?? 0,
                avgCurrent: row.avgCurrent ?? row.avg_avg_current ?? row.avg_current ?? 0,
            }));
            // Final check before updating - prevent race condition
            if (requestId !== currentHourlyRequest ||
                targetDate !== selectedDate.value) {
                return;
            }
            hourlyReports.value = normalized;
            localStorage.setItem(cacheKey(targetDate), JSON.stringify(normalized));
        }
    }
    catch (err) {
        // Only set error if this is still the current request
        if (requestId === currentHourlyRequest &&
            targetDate === selectedDate.value) {
            errorHourly.value = String(err);
        }
    }
    finally {
        // Only clear loading if this is still the current request
        if (requestId === currentHourlyRequest &&
            targetDate === selectedDate.value) {
            loadingHourly.value = false;
        }
    }
}
// Debounced data loading to prevent rapid API calls
watch(selectedDate, () => {
    if (dateChangeTimer) {
        clearTimeout(dateChangeTimer);
    }
    // Immediately clear old data to prevent showing stale data
    shiftReports.value = [];
    hourlyReports.value = [];
    errorShift.value = null;
    errorHourly.value = null;
    dateChangeTimer = setTimeout(() => {
        loadShiftReports();
        if (activeTab.value === "hourly") {
            loadHourlyReports();
        }
    }, 150); // 150ms debounce
});
// Load hourly data only when tab is switched
watch(activeTab, (newTab) => {
    if (newTab === "hourly" && hourlyReports.value.length === 0) {
        loadHourlyReports();
    }
});
// CSV Export
function escapeCSV(value) {
    if (value === null || value === undefined)
        return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}
function generateShiftCSV() {
    const headers = [
        "LVMDP",
        "Tanggal",
        "Shift",
        "Total kWh",
        "Avg kWh",
        "Avg Current (A)",
        "Power Factor",
    ];
    const rows = shiftReports.value.map((row) => [
        `LVMDP ${panelId}`,
        formatDate(selectedDate.value),
        `Shift ${row.shift}`,
        row.totalKwh,
        row.avgKwh,
        row.iavg,
        row.cosPhi,
    ]);
    return [
        headers.map(escapeCSV).join(","),
        ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");
}
function generateHourlyCSV() {
    const headers = [
        "LVMDP",
        "Tanggal",
        "Waktu",
        "Total kWh",
        "Avg kWh",
        "Power Factor",
        "Avg Current (A)",
    ];
    const rows = hourlyReports.value.map((row) => [
        `LVMDP ${panelId}`,
        formatDate(selectedDate.value),
        formatTime(row.hour),
        row.totalKwh,
        row.avgKwh,
        row.cosPhi,
        row.avgCurrent,
    ]);
    return [
        headers.map(escapeCSV).join(","),
        ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");
}
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function downloadByDate() {
    const dateFormatted = selectedDate.value.replace(/-/g, "-");
    const shiftCSV = generateShiftCSV();
    const hourlyCSV = generateHourlyCSV();
    downloadCSV(shiftCSV, `LVMDP${panelId}_ShiftReport_${dateFormatted}.csv`);
    setTimeout(() => {
        downloadCSV(hourlyCSV, `LVMDP${panelId}_HourlyReport_${dateFormatted}.csv`);
    }, 100);
    showDownloadMenu.value = false;
}
function downloadByMonth() {
    const [year, month] = selectedDate.value.split("-");
    const monthFormatted = `${year}-${month}`;
    const shiftCSV = generateShiftCSV();
    const hourlyCSV = generateHourlyCSV();
    downloadCSV(shiftCSV, `LVMDP${panelId}_ShiftReport_${monthFormatted}.csv`);
    setTimeout(() => {
        downloadCSV(hourlyCSV, `LVMDP${panelId}_HourlyReport_${monthFormatted}.csv`);
    }, 100);
    showDownloadMenu.value = false;
}
onMounted(() => {
    loadShiftReports();
    // Only load hourly if tab is active (lazy loading)
    if (activeTab.value === "hourly") {
        loadHourlyReports();
    }
    window.addEventListener("click", handleWindowClick);
});
onUnmounted(() => {
    window.removeEventListener("click", handleWindowClick);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['date-picker-group']} */ ;
/** @type {__VLS_StyleScopedClasses['date-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['date-input']} */ ;
/** @type {__VLS_StyleScopedClasses['date-input']} */ ;
/** @type {__VLS_StyleScopedClasses['download-button']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-button']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-table']} */ ;
/** @type {__VLS_StyleScopedClasses['hourly-table']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-table']} */ ;
/** @type {__VLS_StyleScopedClasses['hourly-table']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-row']} */ ;
/** @type {__VLS_StyleScopedClasses['hourly-row']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-table']} */ ;
/** @type {__VLS_StyleScopedClasses['hourly-table']} */ ;
/** @type {__VLS_StyleScopedClasses['report-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['header-section']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['header-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['date-picker-group']} */ ;
/** @type {__VLS_StyleScopedClasses['content-section']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-table']} */ ;
/** @type {__VLS_StyleScopedClasses['hourly-table']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-table']} */ ;
/** @type {__VLS_StyleScopedClasses['hourly-table']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-table']} */ ;
/** @type {__VLS_StyleScopedClasses['hourly-table']} */ ;
/** @type {__VLS_StyleScopedClasses['tabs-header']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-button']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['date-display']} */ ;
/** @type {__VLS_StyleScopedClasses['numeric']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "report-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "report-container" },
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
(__VLS_ctx.panelId);
// @ts-ignore
[panelId,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-controls" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (__VLS_ctx.openDatePicker) },
    ...{ class: "date-picker-group" },
});
// @ts-ignore
[openDatePicker,];
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "date-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "date-input-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.input)({
    ref: "dateInput",
    type: "date",
    min: (__VLS_ctx.minDate),
    max: (__VLS_ctx.maxDate),
    ...{ class: "date-input" },
});
(__VLS_ctx.selectedDate);
/** @type {typeof __VLS_ctx.dateInput} */ ;
// @ts-ignore
[minDate, maxDate, selectedDate, dateInput,];
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "date-display" },
});
(__VLS_ctx.formatDate(__VLS_ctx.selectedDate));
// @ts-ignore
[selectedDate, formatDate,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: () => { } },
    ...{ class: "download-menu" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.toggleDownloadMenu) },
    type: "button",
    ...{ class: "download-button" },
    title: "Download as CSV",
});
// @ts-ignore
[toggleDownloadMenu,];
const __VLS_0 = {}.Download;
/** @type {[typeof __VLS_components.Download, ]} */ ;
// @ts-ignore
Download;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "download-icon-svg" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "download-icon-svg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "download-text" },
});
if (__VLS_ctx.showDownloadMenu) {
    // @ts-ignore
    [showDownloadMenu,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "download-dropdown" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.downloadByDate) },
        ...{ class: "dropdown-item" },
        title: "Download data for selected date",
    });
    // @ts-ignore
    [downloadByDate,];
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "icon" },
    });
    const __VLS_5 = {}.CalendarSearch;
    /** @type {[typeof __VLS_components.CalendarSearch, ]} */ ;
    // @ts-ignore
    CalendarSearch;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        ...{ class: "icon-svg" },
    }));
    const __VLS_7 = __VLS_6({
        ...{ class: "icon-svg" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.downloadByMonth) },
        ...{ class: "dropdown-item" },
        title: "Download data for selected month",
    });
    // @ts-ignore
    [downloadByMonth,];
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "icon" },
    });
    const __VLS_10 = {}.HardDriveUpload;
    /** @type {[typeof __VLS_components.HardDriveUpload, ]} */ ;
    // @ts-ignore
    HardDriveUpload;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        ...{ class: "icon-svg" },
    }));
    const __VLS_12 = __VLS_11({
        ...{ class: "icon-svg" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tabs-header" },
});
for (const [tab] of __VLS_getVForSourceType((['shift', 'hourly']))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.activeTab = tab;
                // @ts-ignore
                [activeTab,];
            } },
        key: (tab),
        ...{ class: (['tab-button', { active: __VLS_ctx.activeTab === tab }]) },
    });
    // @ts-ignore
    [activeTab,];
    if (tab === 'shift') {
        const __VLS_15 = {}.FileChartColumn;
        /** @type {[typeof __VLS_components.FileChartColumn, ]} */ ;
        // @ts-ignore
        FileChartColumn;
        // @ts-ignore
        const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
            ...{ class: "tab-icon-svg" },
        }));
        const __VLS_17 = __VLS_16({
            ...{ class: "tab-icon-svg" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    }
    else {
        const __VLS_20 = {}.ClockFading;
        /** @type {[typeof __VLS_components.ClockFading, ]} */ ;
        // @ts-ignore
        ClockFading;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            ...{ class: "tab-icon-svg" },
        }));
        const __VLS_22 = __VLS_21({
            ...{ class: "tab-icon-svg" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    }
    (tab === "shift" ? "Shift Reports" : "Hourly Reports");
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content-section" },
});
if (__VLS_ctx.activeTab === 'shift') {
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "tab-content" },
    });
    if (__VLS_ctx.loadingShift) {
        // @ts-ignore
        [loadingShift,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "loading" },
        });
    }
    else if (__VLS_ctx.errorShift) {
        // @ts-ignore
        [errorShift,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "error" },
        });
        (__VLS_ctx.errorShift);
        // @ts-ignore
        [errorShift,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "shift-table-wrapper" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.table, __VLS_intrinsics.table)({
            ...{ class: "shift-table" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsics.thead, __VLS_intrinsics.thead)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
        __VLS_asFunctionalElement(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
        for (const [row, idx] of __VLS_getVForSourceType((__VLS_ctx.shiftReports))) {
            // @ts-ignore
            [shiftReports,];
            __VLS_asFunctionalElement(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
                key: (idx),
                ...{ class: "shift-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
                ...{ class: "shift-name" },
            });
            (row.shift);
            __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
                ...{ class: "numeric" },
            });
            (__VLS_ctx.formatNumber(row.totalKwh));
            // @ts-ignore
            [formatNumber,];
            __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
                ...{ class: "numeric" },
            });
            (__VLS_ctx.formatNumber(row.avgKwh));
            // @ts-ignore
            [formatNumber,];
            __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
                ...{ class: "numeric" },
            });
            (__VLS_ctx.formatNumber(row.iavg));
            // @ts-ignore
            [formatNumber,];
            __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
                ...{ class: "numeric" },
            });
            (__VLS_ctx.formatNumber(row.cosPhi));
            // @ts-ignore
            [formatNumber,];
        }
    }
}
if (__VLS_ctx.activeTab === 'hourly') {
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "tab-content" },
    });
    if (__VLS_ctx.loadingHourly) {
        // @ts-ignore
        [loadingHourly,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "loading" },
        });
    }
    else if (__VLS_ctx.errorHourly) {
        // @ts-ignore
        [errorHourly,];
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "error" },
        });
        (__VLS_ctx.errorHourly);
        // @ts-ignore
        [errorHourly,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "hourly-table-wrapper" },
        });
        if (__VLS_ctx.hourlyReports.length === 0) {
            // @ts-ignore
            [hourlyReports,];
            __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "empty-state" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsics.table, __VLS_intrinsics.table)({
                ...{ class: "hourly-table" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsics.thead, __VLS_intrinsics.thead)({});
            __VLS_asFunctionalElement(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
            __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
            __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
            __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
            __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
            __VLS_asFunctionalElement(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
            __VLS_asFunctionalElement(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
            for (const [row, idx] of __VLS_getVForSourceType((__VLS_ctx.hourlyReports))) {
                // @ts-ignore
                [hourlyReports,];
                __VLS_asFunctionalElement(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
                    key: (idx),
                    ...{ class: "hourly-row" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
                    ...{ class: "time" },
                });
                (__VLS_ctx.formatTime(row.hour));
                // @ts-ignore
                [formatTime,];
                __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
                    ...{ class: "numeric" },
                });
                (__VLS_ctx.formatNumber(row.totalKwh));
                // @ts-ignore
                [formatNumber,];
                __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
                    ...{ class: "numeric" },
                });
                (__VLS_ctx.formatNumber(row.avgKwh));
                // @ts-ignore
                [formatNumber,];
                __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
                    ...{ class: "numeric" },
                });
                (__VLS_ctx.formatNumber(row.avgCurrent));
                // @ts-ignore
                [formatNumber,];
                __VLS_asFunctionalElement(__VLS_intrinsics.td, __VLS_intrinsics.td)({
                    ...{ class: "numeric" },
                });
                (__VLS_ctx.formatNumber(row.cosPhi));
                // @ts-ignore
                [formatNumber,];
            }
        }
    }
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "cache-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "cache-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "cache-icon" },
});
/** @type {__VLS_StyleScopedClasses['report-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['report-container']} */ ;
/** @type {__VLS_StyleScopedClasses['header-section']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['header-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['date-picker-group']} */ ;
/** @type {__VLS_StyleScopedClasses['date-label']} */ ;
/** @type {__VLS_StyleScopedClasses['date-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['date-input']} */ ;
/** @type {__VLS_StyleScopedClasses['date-display']} */ ;
/** @type {__VLS_StyleScopedClasses['download-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['download-button']} */ ;
/** @type {__VLS_StyleScopedClasses['download-icon-svg']} */ ;
/** @type {__VLS_StyleScopedClasses['download-text']} */ ;
/** @type {__VLS_StyleScopedClasses['download-dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-svg']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-svg']} */ ;
/** @type {__VLS_StyleScopedClasses['tabs-header']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-icon-svg']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-icon-svg']} */ ;
/** @type {__VLS_StyleScopedClasses['content-section']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-content']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-table-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-table']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-row']} */ ;
/** @type {__VLS_StyleScopedClasses['shift-name']} */ ;
/** @type {__VLS_StyleScopedClasses['numeric']} */ ;
/** @type {__VLS_StyleScopedClasses['numeric']} */ ;
/** @type {__VLS_StyleScopedClasses['numeric']} */ ;
/** @type {__VLS_StyleScopedClasses['numeric']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-content']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['hourly-table-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['hourly-table']} */ ;
/** @type {__VLS_StyleScopedClasses['hourly-row']} */ ;
/** @type {__VLS_StyleScopedClasses['time']} */ ;
/** @type {__VLS_StyleScopedClasses['numeric']} */ ;
/** @type {__VLS_StyleScopedClasses['numeric']} */ ;
/** @type {__VLS_StyleScopedClasses['numeric']} */ ;
/** @type {__VLS_StyleScopedClasses['numeric']} */ ;
/** @type {__VLS_StyleScopedClasses['cache-info']} */ ;
/** @type {__VLS_StyleScopedClasses['cache-text']} */ ;
/** @type {__VLS_StyleScopedClasses['cache-icon']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
