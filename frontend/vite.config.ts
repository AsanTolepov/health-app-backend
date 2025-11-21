// frontend/vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
// Polyfillni import qilamiz
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    // Polyfillni shu yerga qo'shamiz
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  define: {
    // Bu global o'zgaruvchi simple-peer uchun kerak
    global: 'globalThis',
  },
  server: {
    allowedHosts: true,
  },
});