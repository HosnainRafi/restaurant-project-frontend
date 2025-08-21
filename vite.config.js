import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url"; // 👈 Import Node.js URL helpers

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // ✅ Use this modern syntax to define the alias
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
