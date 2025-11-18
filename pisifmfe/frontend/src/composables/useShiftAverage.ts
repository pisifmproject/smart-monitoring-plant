import { ref, onMounted } from "vue";
import { getShiftAvg } from "@/lib/api";

export function useShiftAverages(panelId: 1|2|3|4, dateStr?: string) {
  const s1 = ref({ avgKwh: 0, avgCurrent: 0, count: 0 });
  const s2 = ref({ avgKwh: 0, avgCurrent: 0, count: 0 });
  const s3 = ref({ avgKwh: 0, avgCurrent: 0, count: 0 });

  async function reload() {
    try {
      const d = await getShiftAvg(panelId, dateStr);
      s1.value = d.shift1; 
      s2.value = d.shift2; 
      s3.value = d.shift3;
    } catch (error) {
      console.error("failed to load shift averages:", error);
    }
  }

  onMounted(reload);
  return { s1, s2, s3, reload };
}
