import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** Для GitHub Pages: https://maksimrafikov.github.io/wall-area-calculator/ */
const base = process.env.GITHUB_PAGES === "true" ? "/wall-area-calculator/" : "/";

export default defineConfig({
  base,
  plugins: [react()],
});
