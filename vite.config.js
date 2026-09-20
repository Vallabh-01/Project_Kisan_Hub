import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/weather/current": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/api/weather/forecast": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/api/weather-alerts": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/api/agri-news": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/api/scheme-news": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/api/quotes": {
        target: "https://zenquotes.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/quotes/, "/api"),
      },
    },
  },
});
