import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kindawhimsical.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
