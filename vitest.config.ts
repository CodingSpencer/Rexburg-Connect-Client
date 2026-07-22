import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

console.log("VITEST CONFIG LOADED");

export default defineConfig({
  plugins: [svelte()],
  test: {
    include: ["src/tests/unit/**/*.test.js"],
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.js"],
  },
});
