import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "vue-vendor": ["vue", "vue-router"],
          "echarts-vendor": [
            "echarts/core",
            "echarts/charts",
            "echarts/components",
            "echarts/renderers",
          ],
          "ui-vendor": ["lucide-vue-next"],
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 30,
    proxy: {
      "/api": {
        target: "http://localhost:2000", // sesuaikan dengan PORT backend
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:2000", // sesuaikan dengan PORT backend
        ws: true,
      },
    },
  },
});
