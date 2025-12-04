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
   * Setup auto-refresh every 5 minutes
   * More frequent refresh to catch new shift data updates
   */
  function setupAutoRefresh() {
    // Only auto-refresh for today's data (no dateStr provided)
    if (dateStr) return;

    // Refresh every 5 minutes
    intervalId = window.setInterval(() => {
      reload();
    }, 5 * 60 * 1000); // 5 minutes
  }

  onMounted(() => {
    reload();
    setupAutoRefresh();
  });

  onUnmounted(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  });

  return { s1, s2, s3, reload };
}
