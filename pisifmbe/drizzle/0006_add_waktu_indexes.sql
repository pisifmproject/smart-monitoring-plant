-- Add indexes on waktu column for faster date filtering
-- These indexes will significantly speed up queries with WHERE waktu >= ... clauses

CREATE INDEX IF NOT EXISTS idx_lvmdp_1_waktu ON public.lvmdp_1(waktu);
CREATE INDEX IF NOT EXISTS idx_lvmdp_2_waktu ON public.lvmdp_2(waktu);
CREATE INDEX IF NOT EXISTS idx_lvmdp_3_waktu ON public.lvmdp_3(waktu);
CREATE INDEX IF NOT EXISTS idx_lvmdp_4_waktu ON public.lvmdp_4(waktu);

-- Optional: Add composite indexes if you frequently filter by both waktu and other columns
-- CREATE INDEX IF NOT EXISTS idx_lvmdp_1_waktu_kwh ON public.lvmdp_1(waktu, total_kwh);
