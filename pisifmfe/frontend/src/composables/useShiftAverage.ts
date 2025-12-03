import { ref, onMounted, onUnmounted } from "vue";
import { getShiftAvg } from "@/lib/api";

export function useShiftAverages(panelId: 1 | 2 | 3 | 4, dateStr?: string) {
  const s1 = ref({ avgPower: 0, avgCurrent: 0, count: 0 });
  const s2 = ref({ avgPower: 0, avgCurrent: 0, count: 0 });
  const s3 = ref({ avgPower: 0, avgCurrent: 0, count: 0 });
  let intervalId: number | null = null;

  async function reload() {
    try {
      const d = await getShiftAvg(panelId, dateStr);
      s1.value = d.shift1;
      s2.value = d.shift2;
      s3.value = d.shift3;
    } catch (error) {
      // console.error("failed to load shift averages:", error);
    }
  }

  /**
   * Setup auto-refresh every hour at :06 minute
   * Sync with hourly report schedule (runs at :05)
   */
  function setupHourlyRefresh() {
    // Only auto-refresh for today's data (no dateStr provided)
    if (dateStr) return;

    const scheduleNextRefresh = () => {
      const now = new Date();
      const nextRun = new Date(now);

      // Set to next :06 minute
      if (now.getMinutes() >= 6) {
        // Next hour at :06
        nextRun.setHours(nextRun.getHours() + 1);
      }
      nextRun.setMinutes(6);
      nextRun.setSeconds(0);
      nextRun.setMilliseconds(0);

      const msUntilNext = nextRun.getTime() - now.getTime();

      // Schedule the refresh
      intervalId = window.setTimeout(() => {
        reload();
        scheduleNextRefresh(); // Schedule next refresh
      }, msUntilNext);
    };

    scheduleNextRefresh();
  }

  onMounted(() => {
    reload();
    setupHourlyRefresh();
  });

  onUnmounted(() => {
    if (intervalId !== null) {
      clearTimeout(intervalId);
    }
  });

  return { s1, s2, s3, reload };
}
