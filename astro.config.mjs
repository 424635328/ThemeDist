import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import netlify from '@astrojs/netlify';

const adapter = process.env.ADAPTER === 'netlify' ? netlify() : vercel();

export default defineConfig({
  output: 'server',
  adapter,
  site: process.env.URL || 'http://localhost:4321',
});
