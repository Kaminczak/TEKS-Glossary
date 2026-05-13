import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves project sites at /<repo-name>/. We set base accordingly
// for production builds; dev still runs at root (/).
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/TEKS-Glossary/" : "/",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
}));
