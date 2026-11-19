// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ariya-sarrafzadeh.ir',
  integrations: [mdx(), sitemap(), react()],
  // Self-hosted at build time: no render-blocking third-party CSS chain.
  fonts: [
    { provider: fontProviders.google(), name: 'IBM Plex Sans', cssVariable: '--font-plex-sans', weights: [300, 400, 500, 600, 700], styles: ['normal', 'italic'], subsets: ['latin'], fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'] },
    { provider: fontProviders.google(), name: 'IBM Plex Sans Condensed', cssVariable: '--font-plex-condensed', weights: [500, 600, 700], styles: ['normal'], subsets: ['latin'], fallbacks: ['sans-serif'] },
    { provider: fontProviders.google(), name: 'IBM Plex Mono', cssVariable: '--font-plex-mono', weights: [400, 500, 600, 700], styles: ['normal'], subsets: ['latin'], fallbacks: ['monospace'] },
    { provider: fontProviders.google(), name: 'Vazirmatn', cssVariable: '--font-vazirmatn', weights: [300, 400, 500, 600, 700, 800, 900], styles: ['normal'], subsets: ['arabic', 'latin'], fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Tahoma', 'sans-serif'] },
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client'],
    },
  },
});
