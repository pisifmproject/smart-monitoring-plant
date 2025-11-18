# 📋 PISIFM Frontend - Environment Documentation

Dokumentasi lengkap tech stack, dependencies, dan konfigurasi PISIFM Frontend Application.

---

## 📚 Table of Contents

- [Framework & Runtime](#framework--runtime)
- [Build Tools & Development](#build-tools--development)
- [Styling & CSS](#styling--css)
- [Data Visualization](#data-visualization)
- [Networking & Communication](#networking--communication)
- [Development Dependencies](#development-dependencies)
- [TypeScript Configuration](#typescript-configuration)
- [Build Scripts](#build-scripts)
- [Server Proxy Configuration](#server-proxy-configuration)
- [Custom Components](#custom-components)
- [Composables (Reusable Logic)](#composables-reusable-logic)
- [Views & Pages](#views--pages)
- [Design System](#design-system)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)

---

## 🚀 Framework & Runtime

| Teknologi      | Versi   | Fungsi                                    |
| -------------- | ------- | ----------------------------------------- |
| **Node.js**    | LTS     | JavaScript runtime environment            |
| **Vue.js**     | ^3.5.22 | Progressive JavaScript framework untuk UI |
| **Vue Router** | ^4.6.3  | Client-side routing dan navigation        |
| **TypeScript** | ~5.9.3  | Superset JavaScript dengan type safety    |

### Vue 3 Features Used:

- Composition API (`ref`, `computed`, `onMounted`)
- Single File Components (SFC) dengan `<script setup>`
- Reactive state management
- Dynamic route-based navigation

---

## 🛠️ Build Tools & Development

| Teknologi              | Versi  | Fungsi                                           |
| ---------------------- | ------ | ------------------------------------------------ |
| **Vite**               | ^7.1.7 | Fast build tool & dev server (⚡ lightning fast) |
| **@vitejs/plugin-vue** | ^6.0.1 | Vue 3 integration untuk Vite                     |
| **vue-tsc**            | ^3.1.0 | TypeScript compiler untuk Vue components         |

### Vite Benefits:

- ✅ Instant server start
- ✅ Lightning fast HMR (Hot Module Replacement)
- ✅ Optimized production builds
- ✅ Native ESM support

---

## 🎨 Styling & CSS

| Teknologi        | Versi    | Fungsi                                           |
| ---------------- | -------- | ------------------------------------------------ |
| **Tailwind CSS** | ^3.4.18  | Utility-first CSS framework                      |
| **PostCSS**      | ^8.5.6   | CSS transformer tool                             |
| **Autoprefixer** | ^10.4.22 | Auto add vendor prefixes untuk CSS compatibility |

### Tailwind Features Used:

- ✅ Responsive design utilities (`sm:`, `md:`, `lg:` breakpoints)
- ✅ Gradient backgrounds (`from-cyan-500 to-blue-500`)
- ✅ Shadow utilities (`shadow-lg`)
- ✅ Custom animations (`animate-float-slow`, `animate-pulse`)
- ✅ Dark mode support

---

## 📊 Data Visualization

| Teknologi       | Versi  | Fungsi                                               |
| --------------- | ------ | ---------------------------------------------------- |
| **ECharts**     | ^6.0.0 | JavaScript charting library untuk data visualization |
| **vue-echarts** | ^8.0.1 | Vue wrapper untuk ECharts integration                |

### Used For:

- 📈 Gauge charts (Power, Frequency, Power Factor metrics)
- 🎯 Real-time monitoring visualization
- 🎨 Dynamic color-coded status indicators

---

## 🌐 Networking & Communication

| Teknologi            | Versi   | Fungsi                                              |
| -------------------- | ------- | --------------------------------------------------- |
| **Axios**            | ^1.13.2 | HTTP client untuk API requests                      |
| **Socket.IO Client** | ^4.8.1  | Real-time bidirectional communication via WebSocket |

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

### Key Settings:

- ✅ **Strict Mode**: Enabled untuk type safety maksimal
- ✅ **Target ES2020**: Modern JavaScript features
- ✅ **Path Alias**: `@/*` points ke `src/*` untuk cleaner imports
- ✅ **Module Resolution**: Bundler strategy untuk optimal performance

---

## 📝 Build Scripts

### Development

```bash
npm run dev
```

- Starts Vite dev server pada `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- Real-time component reloading

### Production Build

```bash
npm run build
```

- Runs TypeScript type checking (`vue-tsc -b`)
- Optimizes bundle dengan Vite
- Output ke `dist/` folder

### Preview Build

```bash
npm run preview
```

- Preview production build locally
- Untuk testing sebelum deployment

---

## 🔗 Server Proxy Configuration

```typescript
server: {
  port: 5173,
  proxy: {
    "/api": {
      target: "http://localhost:2000",
      changeOrigin: true
    },
    "/socket.io": {
      target: "http://localhost:2000",
      ws: true  // Enable WebSocket
    }
  }
}
```

### Requirements:

- Backend API server running di `http://localhost:2000`
- Adjust port jika backend menggunakan port berbeda
- WebSocket proxy untuk real-time data communication

---

## 🧩 Custom Components

| Komponen        | File                         | Deskripsi                                |
| --------------- | ---------------------------- | ---------------------------------------- |
| **brandLogo**   | `components/brandLogo.vue`   | Indofood logo dengan glow effect         |
| **sideBar**     | `components/sideBar.vue`     | Navigation sidebar dengan menu items     |
| **gaugeSimple** | `components/gaugeSimple.vue` | ECharts gauge untuk metric visualization |
| **shiftCard**   | `components/shiftCard.vue`   | Shift performance cards dengan kW & Iavg |
| **statusBar**   | `components/statusBar.vue`   | Connection status indicator              |
| **infoCard**    | `components/infoCard.vue`    | Generic info display card                |

### Component Features:

- 📦 Fully reusable & composable
- 🎨 Consistent styling dengan Tailwind CSS
- 🔄 Reactive props & events
- 📱 Responsive design built-in

---

## 🪝 Composables (Reusable Logic)

| Composable          | File                             | Fungsi                                            |
| ------------------- | -------------------------------- | ------------------------------------------------- |
| **useLvmdpLive**    | `composables/useLvmdpLive.ts`    | Real-time WebSocket data handling untuk LVMDP 1-4 |
| **useShiftAverage** | `composables/useShiftAverage.ts` | Calculate & aggregate shift performance metrics   |

### Usage Pattern:

```typescript
const { lvmdpData, isConnected } = useLvmdpLive(lvmdpNumber);
const { averagePower, averageCurrent } = useShiftAverage(shiftData);
```

### Benefits:

- ✅ Logic separation dari UI components
- ✅ Reusable across multiple views
- ✅ Easier testing & maintenance
- ✅ Cleaner component code

---

## 📄 Views & Pages

| View        | File                | Deskripsi                               |
| ----------- | ------------------- | --------------------------------------- |
| **Landing** | `views/landing.vue` | Public homepage dengan hero section     |
| **LVMDP 1** | `views/lvmdp1.vue`  | Dashboard page untuk LVMDP 1 monitoring |
| **LVMDP 2** | `views/lvmdp2.vue`  | Dashboard page untuk LVMDP 2 monitoring |
| **LVMDP 3** | `views/lvmdp3.vue`  | Dashboard page untuk LVMDP 3 monitoring |
| **LVMDP 4** | `views/lvmdp4.vue`  | Dashboard page untuk LVMDP 4 monitoring |

### Page Structure:

```
LVMDP Dashboard Pages
├── Sidebar Navigation
├── Topbar dengan Breadcrumb
├── Shift Performance Section (3 cards)
├── Real-Time Metrics Section (3 gauges)
└── Status Bar (connection indicator)
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Accent */
--color-cyan: #0ea5e9
--color-blue: #3b82f6

/* Dark Mode Background */
--bg-dark-primary: #1a1f2e
--bg-dark-secondary: #111827
--bg-dark-tertiary: #0f172a

/* Light Mode Background */
--bg-light: #f8fafc

/* Text Colors */
--text-primary: #0f172a
--text-secondary: #475569
--text-tertiary: #64748b
```

### Shadows

**Standard Shadow:**

```css
0 4px 12px rgba(0,0,0,0.1)
```

**Hover State:**

```css
0 10px 25px rgba(0,0,0,0.12)
```

### Responsive Breakpoints

| Breakpoint | Width  | Device        |
| ---------- | ------ | ------------- |
| `sm`       | 640px  | Small phone   |
| `md`       | 768px  | Tablet        |
| `lg`       | 1024px | Desktop       |
| `xl`       | 1280px | Large desktop |

### Custom Animations

```css
@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

---

## 📁 Folder Structure

```
frontend/
│
├── src/
│   ├── components/              # Reusable Vue components
│   │   ├── brandLogo.vue
│   │   ├── gaugeSimple.vue
│   │   ├── infoCard.vue
│   │   ├── shiftCard.vue
│   │   ├── sideBar.vue
│   │   └── statusBar.vue
│   │
│   ├── composables/             # Reusable logic (composition functions)
│   │   ├── useLvmdpLive.ts
│   │   └── useShiftAverage.ts
│   │
│   ├── layouts/                 # Layout wrappers
│   │   └── dashboardLayout.vue
│   │
│   ├── views/                   # Page components (routed)
│   │   ├── landing.vue
│   │   ├── lvmdp1.vue
│   │   ├── lvmdp2.vue
│   │   ├── lvmdp3.vue
│   │   └── lvmdp4.vue
│   │
│   ├── router/                  # Vue Router configuration
│   │   └── index.ts
│   │
│   ├── lib/                     # Utility functions
│   │   ├── api.ts               # Axios HTTP client setup
│   │   └── socket.ts            # Socket.IO client setup
│   │
│   ├── assets/                  # Static assets
│   │   └── tailwind.css
│   │
│   ├── App.vue                  # Root component
│   ├── main.ts                  # Application entry point
│   ├── style.css                # Global styles
│   └── types.ts                 # TypeScript type definitions
│
├── public/                      # Static files (served as-is)
│
├── Configuration Files
│   ├── vite.config.ts           # Vite build configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── tsconfig.app.json.bckp   # Backup (deprecated)
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── package.json             # Dependencies & scripts
│   └── index.html               # HTML entry point
│
├── .vscode/
│   └── extensions.json          # Recommended VS Code extensions
│
├── .gitignore                   # Git ignore rules
├── README.md                    # Project readme
└── ENVIRONMENT.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16+ recommended, LTS)
- **npm** (v7+) atau **yarn**
- **Git**

### Installation

1. **Clone repository**

   ```bash
   git clone <repo-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Aplikasi akan accessible di `http://localhost:5173`

### Environment Setup

**Ensure backend server running di:**

```
http://localhost:2000
```

If using different port, update `vite.config.ts`:

```typescript
proxy: {
  "/api": {
    target: "http://localhost:<PORT>",
    changeOrigin: true
  },
  "/socket.io": {
    target: "http://localhost:<PORT>",
    ws: true
  }
}
```

### Build untuk Production

```bash
npm run build
```

Output akan di folder `dist/` siap untuk deployment.

### Preview Production Build

```bash
npm run preview
```

---

## 📖 Development Guidelines

### Code Style

- ✅ Use TypeScript untuk type safety
- ✅ Use Vue 3 Composition API (tidak legacy Options API)
- ✅ Use Tailwind CSS utilities (tidak inline styles)
- ✅ Use kebab-case untuk component names di template
- ✅ Use path alias `@/` untuk imports

### Component Guidelines

```typescript
// ✅ Good: Use setup script
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

// ❌ Avoid: Legacy Options API
<script>
export default {
  data() { return { count: 0 } }
}
</script>
```

### Styling Guidelines

```vue
<!-- ✅ Good: Tailwind utilities -->
<div
  class="flex items-center justify-center p-4 bg-gradient-to-r from-cyan-500 to-blue-500"
>
  Content
</div>

<!-- ❌ Avoid: Inline styles -->
<div style="display: flex; justify-content: center; padding: 16px;">
  Content
</div>
```

---

## 🐛 Troubleshooting

### Port 5173 Already in Use

```bash
# Use different port
npm run dev -- --port 3000
```

### Backend Connection Issues

- Ensure backend server running di `localhost:2000`
- Check browser console untuk network errors
- Verify proxy configuration di `vite.config.ts`

### TypeScript Errors

```bash
# Clear cache & reinstall
rm -r node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Additional Resources

- **Vue 3 Documentation**: https://vuejs.org/
- **Vite Documentation**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **ECharts**: https://echarts.apache.org/
- **Socket.IO**: https://socket.io/
- **TypeScript**: https://www.typescriptlang.org/

---

## 📝 Version History

| Versi | Tanggal  | Perubahan                         |
| ----- | -------- | --------------------------------- |
| 1.0.0 | Nov 2025 | Initial environment documentation |

---

## 📧 Support

Untuk pertanyaan atau issues, silakan buat GitHub issue atau contact tim development.

---

**Last Updated**: November 2025  
**Maintained By**: @sptianbgus  
**License**: Confidential - Indofood Fortuna Makmur Internal Use Only
