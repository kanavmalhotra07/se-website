import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://sanchienterprises.com',
  compressHTML: true,
  integrations: [react()],
});