// frontend\src\lib\api.ts
import axios from "axios";
export const api = axios.create({
    baseURL: "/api", // akan diproxy ke :2000 saat dev
    withCredentials: true,
});
// ---------- LIST ----------
export async function getLvmdp(id) {
    // backend kamu masih /lvmdp1, /lvmdp2, ...
    const { data } = await api.get(`/lvmdp${id}`);
    return Array.isArray(data) ? data : data?.data ?? [];
}
// helper lama tetap ada biar mudah pindah
export const getLvmdp1 = () => getLvmdp(1);
export const getLvmdp2 = () => getLvmdp(2);
export const getLvmdp3 = () => getLvmdp(3);
export const getLvmdp4 = () => getLvmdp(4);
export async function getLvmdpLatest(panelId) {
    // hasilnya request ke /api/lvmdp/:id/latest -> diproxy ke :2000
    const { data } = await api.get(`/lvmdp/${panelId}/latest`);
    return data;
}
export const getLvmdp1Latest = () => getLvmdpLatest(1);
export const getLvmdp2Latest = () => getLvmdpLatest(2);
export const getLvmdp3Latest = () => getLvmdpLatest(3);
export const getLvmdp4Latest = () => getLvmdpLatest(4);
export async function getShiftAvg(panelId, date) {
    const path = { 1: "/lvmdp1", 2: "/lvmdp2", 3: "/lvmdp3", 4: "/lvmdp4" }[panelId];
    const { data } = await api.get(`${path}/shift-avg`, { params: { date } });
    return data;
}
// ---------- DAILY REPORT ALL DATES ----------
export async function getDailyReportAll(panelId) {
    // Backend yang kita harapkan:
    // GET /api/lvmdp1/daily-report/all  -> { success:true, data:[ {date,shift1,shift2,shift3}, ... ] }
    const { data } = await api.get(`/lvmdp${panelId}/daily-report/all`);
    if (Array.isArray(data))
        return data;
    if (Array.isArray(data?.data))
        return data.data;
    if (Array.isArray(data?.data?.reports))
        return data.data.reports;
    return [];
}
// ---------- DAILY HOURLY REPORT ----------
export async function getDailyHourly(panelId, date) {
    // Backend yang kita harapkan:
    // GET /api/lvmdp1/daily-report/hourly/:date  -> Array of hourly data
    const { data } = await api.get(`/lvmdp${panelId}/daily-report/hourly/${date}`);
    if (Array.isArray(data))
        return data;
    if (Array.isArray(data?.data))
        return data.data;
    return [];
}
