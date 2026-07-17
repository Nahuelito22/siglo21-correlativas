import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // URL de producción (Vercel) — usada para las meta tags Open Graph.
  site: "https://siglo21-correlativas.vercel.app",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
