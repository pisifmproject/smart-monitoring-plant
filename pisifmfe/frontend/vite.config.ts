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
                                                                                                                                                                         