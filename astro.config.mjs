// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5001",
          changeOrigin: true,
        },
      },
    },
  },
});