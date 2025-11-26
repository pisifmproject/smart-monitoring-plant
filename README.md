# 📋 PISIFM Frontend - Environment Documentation

**Last Updated**: November 26, 2025  
**Version**: 2.0  
**License**: Confidential - PT Indofood Fortuna Makmur Internal Use Only
**Developer**: Confidential - PT Indofood Fortuna Makmur Internal Use Only

---

Production monitoring system untuk Indofood factory dengan real-time data visualization.

---

## 📚 Quick Overview

**Project**: PISIFM (Production Information System for Indofood Factory Monitoring)  
**Tech Stack**: Vue 3 + TypeScript + Vite + Tailwind CSS  
**Backend**: Express.js + Drizzle ORM + PostgreSQL  
**Port**: Frontend `localhost:30` | Backend `localhost:2000`

---

## 🏭 System Modules

### 1. **LVMDP (Low Voltage Main Distribution Panel)** - 4 Panels

- Real-time power monitoring (kW, Frequency, Power Factor)
- Shift performance tracking (3 shifts)
- Daily report generation

### 2. **Production Lines** - 8 Machines

- PC39, PC14, TS1000, FCP, TWS56, TWS72, COPACK, IHP
- OEE tracking (Availability, Performance, Quality)
- KWH meter monitoring (Power consumption, Voltage, Current)
- Shift summary (Target vs Actual production)

### 3. **Packing Lines** - 9 Lines (A-I)

**Weigher:**

- Target/Actual packs, Reject count
- Weight metrics (Avg, Min, Max)
- Efficiency tracking

**Bagmaker:**

- Production metrics (Target, Actual, Good, Not Good bags)
- Efficiency (Weigher, BagMaker, Total)
- Quality detection (Metal detect, Printer error, Product in seal, Splice detect)
- Waste management (Film percentage, Speed monitoring)
- Shift performance (3 shifts)

---

## 🚀 Tech Stack

### Frontend

- **Vue 3** (^3.5.22) - Composition API, SFC, Reactive state
- **TypeScript** (~5.9.3) - Type safety
- **Vite** (^7.1.7) - Lightning fast build tool
- **Tailwind CSS** (^3.4.18) - Utility-first styling
- **Vue Router** (^4.6.3) - Client-side routing

### Data Visualization

- **ECharts** (^6.0.0) - Gauge charts, real-time graphs
- **vue-echarts** (^8.0.1) - Vue integration

### Networking

- **Axios** (^1.13.2) - HTTP client
- **Socket.IO** (^4.8.1) - Real-time WebSocket communication

### UI Components

- **lucide-vue-next** - Modern icon library

### Communication Patterns:

```typescript
// REST API calls
axios.get('/api/data')

// Real-time WebSocket events
socket.on('lvmdp1:data', (data) => { ... })
socket.emit('subscribe:lvmdp1')
```

---

## 📦 Development Dependencies

| Teknologi         | Versi   | Fungsi                                           |
| ----------------- | ------- | ------------------------------------------------ |
| **@types/node**   | ^24.6.0 | TypeScript definitions untuk Node.js             |
| **@vue/tsconfig** | ^0.8.1  | Recommended TypeScript config untuk Vue projects |

---

## ⚙️ TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM"],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "types": ["vite/client"]
  }
}
```

---

## 📝 Scripts

```bash
npm run dev       # Dev server (localhost:30)
npm run build     # Production build
npm run preview   # Preview production build
```

---

## 🗂️ Project Structure

```
pisifmfe/frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── brandLogo.vue
│   │   ├── sideBar.vue
│   │   ├── gaugeSimple.vue  # ECharts gauge
│   │   ├── shiftCard.vue    # Shift performance
│   │   ├── statusBar.vue
│   │   └── reportButton.vue
│   │
│   ├── composables/         # Reusable logic
│   │   ├── useLvmdpLive.ts  # LVMDP real-time data
│   │   └── useShiftAverage.ts
│   │
│   ├── views/               # Page components
│   │   ├── lvmdp/           # 4 LVMDP panels
│   │   │   ├── lvmdp1.vue
│   │   │   ├── lvmdp2.vue
│   │   │   ├── lvmdp3.vue
│   │   │   └── lvmdp4.vue
│   │   │
│   │   ├── production/      # 8 production lines
│   │   │   ├── pc39.vue
│   │   │   ├── pc14.vue
│   │   │   ├── ts1000.vue
│   │   │   ├── fcp.vue
│   │   │   ├── tws56.vue
│   │   │   ├── tws72.vue
│   │   │   ├── copack.vue
│   │   │   └── ihp.vue
│   │   │
│   │   ├── packing/         # Packing lines
│   │   │   ├── weigher/     # 9 weigher lines (A-I)
│   │   │   └── bagmaker/    # 9 bagmaker lines (A-I)
│   │   │
│   │   └── dailyReport/     # Daily reports
│   │       ├── lvmdp/
│   │       ├── production/
│   │       ├── weigher/
│   │       └── bagmaker/
│   │
│   ├── router/              # Vue Router config
│   ├── layouts/             # Layout components
│   └── assets/              # Static assets
│
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── tsconfig.json            # TypeScript config
```

---

## 🎨 Design System

### Color Palette

- **Purple**: `#8b5cf6` - Bagmaker theme
- **Cyan/Blue**: `#0ea5e9` - LVMDP theme
- **Green**: `#10b981` - Success states
- **Orange**: `#f59e0b` - Warning states
- **Red**: `#ef4444` - Error states

### Layout Pattern

- **Header**: Gradient background, icon circle, status badge
- **2x2 Grid**: Production overview cards
- **Responsive**: Mobile-first (480px, 768px, 1024px breakpoints)
- **Card Design**: Rounded corners, shadows, hover effects, gradient backgrounds

### Typography

- **Headings**: Inter/System font, bold weights (700-800)
- **Body**: 0.75rem - 1rem
- **Metrics**: 2.125rem - 2.5rem (large values)
- **Labels**: Uppercase, letter-spacing, 0.75rem

---

## 🔌 API Endpoints

### Backend (localhost:2000)

```
GET /api/production/:lineId          # Production data by line
GET /api/packing/bagmaker/:lineId    # Bagmaker data by line
GET /api/packing/weigher/:lineId     # Weigher data by line
Socket.IO /lvmdp/:panelId            # Real-time LVMDP data
```

---

## 🪝 Key Features

- ✅ **Real-time Updates**: Socket.IO for live LVMDP data (30s refresh for others)
- ✅ **Responsive Design**: Mobile-first, tablet, desktop breakpoints
- ✅ **Dark Mode Ready**: Color schemes support dark theme
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Modular Architecture**: Composables, components, views separation
- ✅ **Production Ready**: Optimized builds, lazy loading, code splitting

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js LTS
npm or yarn
Backend running on localhost:2000
```

### Installation

```bash
cd pisifmfe/frontend
npm install
npm run dev  # Start dev server on localhost:30
```

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:2000
VITE_SOCKET_URL=http://localhost:2000
```

---

## 📊 Database Schema (Backend)

### Production Tables

- `production_line_a_pc39` - PC39 data + KWH meter
- `production_line_a_pc14` - PC14 data + KWH meter
- `production_line_a_ts1000` - TS1000 data + KWH meter
- `production_line_a_fcp` - FCP data + KWH meter
- `production_line_a_tws56` - TWS56 data + KWH meter
- `production_line_a_tws72` - TWS72 data + KWH meter
- `production_line_a_copack` - COPACK data + KWH meter
- `production_line_a_ihp` - IHP data + KWH meter

**Fields**: targetProduction, actualProduction, defectCount, oeePercentage, availability, performance, quality, kwhMeter, powerConsumption, voltageInput, currentAmpere

### Packing Tables

- `packing_line_a_weigher` to `packing_line_i_weigher`
- `packing_line_a_bagmaker` to `packing_line_i_bagmaker`

**Bagmaker Fields**: targetBags, actualBags, goodBags, notGoodBags, totalEfficiency, efficiencyWeigher, efficiencyBagMaker, metalDetect, printerError, productInSeal, spliceDetect, actualSpeed, wastedFilmPercentage

**Weigher Fields**: targetPacks, actualPacks, rejectCount, avgWeight, minWeight, maxWeight, efficiency

### LVMDP Tables

- `lvmdp_hmi` - Real-time HMI data (legacy/archive)
- `daily_report_lvmdp_1` to `daily_report_lvmdp_4` - Daily aggregated reports

---

## 🔧 Recent Updates (Nov 2025)

### Database Schema

✅ Added KWH meter fields to all production tables  
✅ Extended bagmaker tables with 11 new fields (quality detection, efficiency breakdown, waste tracking)  
✅ Preserved LVMDP tables (no changes)

### Frontend

✅ Redesigned LVMDP with elegant layout (cyan theme, icon circles, section headers)  
✅ Reduced bagmaker card sizes (proporsional: 20px padding, 2.125rem fonts, 120px min-height)  
✅ Fixed responsive mobile layout (overflow-x hidden, proper grid breakpoints)  
✅ Fixed efficiency bar bug on mobile/half screen

### Backend

✅ Added endpoint `/api/production/:lineId` for line-specific data  
✅ Added endpoint `/api/packing/bagmaker/:lineId` with full field support  
✅ Added endpoint `/api/packing/weigher/:lineId`  
✅ Updated repositories with proper field mapping  
✅ Database migration completed successfully

---

## 📝 Notes

- **DO NOT** touch LVMDP database/backend (already correct)
- Frontend uses auto-refresh: LVMDP (Socket.IO), Others (30s polling)
- All 9 bagmaker lines (A-I) use batch update pattern
- Design philosophy: Proporsional, elegant, not too big, not too small

---
