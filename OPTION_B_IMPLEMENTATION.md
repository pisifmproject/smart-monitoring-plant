# Option B Implementation - Plant Data Separation & Layout Fixes

## Summary

Implementasi Option B sudah selesai dengan pemisahan route untuk plant Cikupa (real data) vs plant lainnya (dummy data simulation).

## Changes Implemented

### 1. Decimal Places Enforcement ✅

- **Status**: Sudah benar dari sebelumnya
- **Location**: Semua component menggunakan `.toFixed(2)` atau `formatNumber` dengan max 2 decimals
- **Files Verified**:
  - `SummaryPanelDashboard.vue` - Sudah benar
  - `UtilityDashboard.vue` - Sudah benar dengan `Math.min(decimals, 2)`
  - `GlobalDashboard.vue` - Sudah benar dengan `Math.min(decimals, 2)`

### 2. Responsive Layout Fix ✅

- **File**: `pisifmfe/frontend/src/views/summary/SummaryPanelDashboard.vue`
- **Changes**:

  ```css
  .summary-dashboard {
    padding: 32px;
    max-width: 1600px;
    margin: 0 auto;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }

  @media (max-width: 1280px) {
    .summary-dashboard {
      padding: 24px;
      max-width: 1200px;
    }
  }

  @media (min-width: 1920px) {
    .summary-dashboard {
      max-width: 1800px;
      padding: 40px;
    }
  }
  ```

- **Result**: Layout tidak lagi mepet kiri-kanan, ter-center dengan baik

### 3. Color Scheme Matching ref_truth ✅

- **Status**: Sudah match dengan ref_truth
- **GlobalDashboard.vue**:
  - Background cards: `from-slate-800 to-slate-900`
  - Borders: `border-slate-700`
  - Text colors: white, slate-300, slate-400
- **PlantDashboard.vue**: Sama dengan GlobalDashboard
- **SummaryPanelDashboard.vue**: Updated dengan gradient background

### 4. Route Separation: Cikupa vs Other Plants ✅

#### New Component Created

**File**: `pisifmfe/frontend/src/views/electrical/ElectricalDummyDashboard.vue`

- **Purpose**: Dashboard simulasi electrical untuk plant selain Cikupa
- **Features**:
  - Alert banner: "Simulation Mode - Real-time monitoring only available for Plant Cikupa"
  - 4 Summary metric cards (Total Power, Total Energy, Avg Voltage, Load Factor)
  - 4 Dummy panel cards dengan data simulasi
  - Auto-refresh setiap 30 detik
  - Fully responsive layout
  - Color scheme matching ref_truth

#### Router Configuration Updated

**File**: `pisifmfe/frontend/src/router/index.ts`

**Changes**:

1. **Import ElectricalDummyDashboard**:

   ```typescript
   import ElectricalDummyDashboard from "../views/electrical/ElectricalDummyDashboard.vue";
   ```

2. **Route Guard untuk Electrical Panels**:

   ```typescript
   {
     path: "plant/:plantId/electrical/panels",
     name: "plantElectricalPanels",
     component: SummaryPanelDashboard,
     beforeEnter: (to, from, next) => {
       const plantId = to.params.plantId as string;
       if (plantId?.toUpperCase() === "CIKUPA") {
         next(); // Real LVMDP data for Cikupa
       } else {
         // Redirect to dummy dashboard for other plants
         next({ name: "plantElectricalDummy", params: { plantId } });
       }
     },
   },
   ```

3. **New Dummy Route**:

   ```typescript
   {
     path: "plant/:plantId/electrical/dummy",
     name: "plantElectricalDummy",
     component: ElectricalDummyDashboard,
   },
   ```

4. **Cikupa-Only Panel Routes**:
   ```typescript
   {
     path: "plant/CIKUPA/electrical/panel1",
     name: "cikupaPanel1",
     component: Lvmdp1,
   },
   // ... panel2, panel3, panel4
   ```

## How It Works

### Navigation Flow

1. **User di Global Dashboard** → Click plant card
2. **Plant Dashboard** → Click "Energy & Utilities" → "Electrical"
3. **Route Decision**:
   - **Jika Plant = CIKUPA**:
     - Route: `/app/plant/CIKUPA/electrical/panels`
     - Component: `SummaryPanelDashboard` (Real LVMDP data)
     - Individual panels accessible: panel1-4
   - **Jika Plant ≠ CIKUPA** (Semarang, Cikokol, Agro):
     - Route: `/app/plant/:plantId/electrical/dummy`
     - Component: `ElectricalDummyDashboard` (Simulation)
     - Individual panels NOT accessible

### Data Flow

#### Cikupa (Real Data)

```
User → /plant/CIKUPA/electrical/panels
     → SummaryPanelDashboard
     → API: /api/summary/electrical
     → Database: lvmdp_1, lvmdp_2, lvmdp_3, lvmdp_4
     → Display real-time LVMDP data
```

#### Other Plants (Dummy Data)

```
User → /plant/SEMARANG/electrical/panels
     → beforeEnter guard redirects
     → /plant/SEMARANG/electrical/dummy
     → ElectricalDummyDashboard
     → Local generateDummyPanels() function
     → Display simulated data with alert banner
```

## Testing Checklist

### ✅ Decimal Places

- [ ] Check GlobalDashboard - all numbers max 2 decimals
- [ ] Check PlantDashboard - all numbers max 2 decimals
- [ ] Check UtilityDashboard - ISO metrics max 2 decimals
- [ ] Check SummaryPanelDashboard (Cikupa) - all LVMDP values max 2 decimals
- [ ] Check ElectricalDummyDashboard - all simulated values max 2 decimals

### ✅ Responsive Layout

- [ ] Test on 1920px - layout centered with proper padding
- [ ] Test on 1280px - layout adjusted with reduced padding
- [ ] Test on 768px - mobile layout without sidebar overlap

### ✅ Color Scheme

- [ ] GlobalDashboard matches ref_truth colors
- [ ] PlantDashboard matches ref_truth colors
- [ ] UtilityDashboard matches ref_truth colors
- [ ] SummaryPanelDashboard has gradient background
- [ ] ElectricalDummyDashboard matches ref_truth colors

### ✅ Route Separation

**Cikupa Testing**:

- [ ] Navigate to Cikupa → Electrical → Shows SummaryPanelDashboard
- [ ] Panel 1-4 links accessible in sidebar
- [ ] Real LVMDP data displayed
- [ ] Daily report button functional

**Other Plants Testing**:

- [ ] Navigate to Semarang → Electrical → Shows ElectricalDummyDashboard
- [ ] Alert banner visible: "Simulation Mode"
- [ ] No panel 1-4 links in sidebar
- [ ] Simulated data displayed
- [ ] Auto-refresh working (30s interval)

**Same flow for**:

- [ ] Cikokol electrical testing
- [ ] Agro electrical testing

## Next Steps: Option A Implementation

Setelah Option B selesai dan ditest, lanjut ke Option A:

### 1. Create Utility Submenu Pages

Berdasarkan ref_truth structure, tambahkan submenu di bawah "Energy & Utilities":

- [ ] **Steam** monitoring dashboard
- [ ] **Water** management dashboard
- [ ] **Compressed Air** monitoring
- [ ] **Nitrogen** supply tracking
- [ ] **Natural Gas** consumption

### 2. Update Sidebar Structure

File: `sideBarSimple.vue`

```typescript
{
  id: "energyUtilities",
  name: "Energy & Utilities",
  icon: Zap,
  route: `/app/plant/${currentPlantId.value}/utilities`,
  children: [
    { id: "electrical", name: "Electrical", route: "..." },
    { id: "steam", name: "Steam", route: "..." },
    { id: "water", name: "Water", route: "..." },
    { id: "compressedAir", name: "Compressed Air", route: "..." },
    { id: "nitrogen", name: "Nitrogen", route: "..." },
    { id: "naturalGas", name: "Natural Gas", route: "..." },
  ],
}
```

### 3. Create Production Line Pages

Berdasarkan ref_truth `mockData.ts`:

- [ ] Cikupa: PC39, PC14, Tortilla, TWS 5.6, TWS 7.2, FCP, Cassava Copack, Cassava Inhouse
- [ ] Cikokol: Potato Chips PC14
- [ ] Semarang: Tempe production
- [ ] Agro: Development plant

### 4. Create Daily Report Pages (Cikupa Only)

- [ ] Electrical daily report page
- [ ] Production daily report page
- [ ] Utility consumption daily report

## Files Modified

### Created

1. `pisifmfe/frontend/src/views/electrical/ElectricalDummyDashboard.vue` (NEW)

### Modified

1. `pisifmfe/frontend/src/router/index.ts`

   - Added ElectricalDummyDashboard import
   - Added route guard for plant separation
   - Updated panel routes to be Cikupa-only

2. `pisifmfe/frontend/src/views/summary/SummaryPanelDashboard.vue`
   - Updated responsive layout with max-width
   - Added gradient background
   - Added responsive breakpoints

### Verified (No Changes Needed)

1. `pisifmfe/frontend/src/views/GlobalDashboard.vue` - Already correct
2. `pisifmfe/frontend/src/views/PlantDashboard.vue` - Already correct
3. `pisifmfe/frontend/src/views/UtilityDashboard.vue` - Already correct
4. `pisifmfe/frontend/src/components/sideBarSimple.vue` - Already correct

## Technical Notes

### Route Guard Pattern

```typescript
beforeEnter: (to, from, next) => {
  const plantId = to.params.plantId as string;
  if (plantId?.toUpperCase() === "CIKUPA") {
    next(); // Allow real data access
  } else {
    next({ name: "plantElectricalDummy", params: { plantId } });
  }
};
```

### Dummy Data Generation

```typescript
const generateDummyPanels = () => {
  return Array.from({ length: 4 }, (_, i) => ({
    id: `Panel ${i + 1}`,
    voltage: 380 + Math.random() * 15,
    current: 100 + Math.random() * 40,
    power: 65 + Math.random() * 35,
    energy: 2400 + Math.random() * 1100,
    powerFactor: 0.85 + Math.random() * 0.1,
  }));
};
```

### Color Palette (ref_truth Standard)

```css
/* Backgrounds */
--bg-dark: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
--bg-card: linear-gradient(135deg, #1e293b 0%, #334155 100%);

/* Borders */
--border-primary: #334155;
--border-secondary: #475569;

/* Text */
--text-primary: #e2e8f0;
--text-secondary: #94a3b8;
--text-tertiary: #cbd5e1;

/* Accents */
--accent-blue: #2563eb;
--accent-emerald: #34d399;
--accent-yellow: #fbbf24;
--accent-rose: #fb7185;
```

## Conclusion

Option B implementation **COMPLETE** ✅

**Achieved**:

1. ✅ Max 2 decimal places enforcement across all components
2. ✅ Responsive layout fixed - no sidebar overlap
3. ✅ Color scheme matching ref_truth
4. ✅ Route separation: Cikupa (real) vs Others (dummy)
5. ✅ ElectricalDummyDashboard component created
6. ✅ Router guard implemented for plant-specific routing

**Ready for**:

- Testing the full flow: Global → Plant → Electrical for all 4 plants
- Option A implementation: utility submenus and production line pages
