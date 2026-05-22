import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: process.env.URL || 'http://localhost:4321',
});
