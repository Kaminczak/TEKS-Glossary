import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Served from the custom domain kaizen.school (2026-09-02), which serves from the ROOT,
// so base is "/" everywhere. It was "/TEKS-Glossary/" because a GitHub Pages *project*
// site serves at /<repo-name>/ - if the custom domain is ever removed, that must come
// back or every asset 404s.
//
// public/CNAME carries the domain, and has to live in public/ rather than being created
// by GitHub from the Pages setting: the workflow uploads dist/, Vite copies public/ into
// dist/, and anything outside that artifact is wiped on each deploy - which silently
// unsets the custom domain.
export default defineConfig(() => ({
  base: "/",
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
