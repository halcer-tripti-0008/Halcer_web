import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

import { seoFiles } from './build/seoFiles.ts';
import { INDEXABLE_ROUTES } from './src/constants/routes.ts';

/**
 * Windows drive letters are case-insensitive, but the bundler compares module paths as
 * strings. When a build starts from a lowercase "c:" working directory (VS Code's terminal
 * often does this), modules reached via the "@" alias and modules reached from the project
 * root resolved `react` under different casings ("c:\…" vs "C:\…"), so React was bundled
 * twice and the production page rendered blank ("Cannot read properties of null (reading
 * 'useEffect')"). Every path Vite derives from is normalised to an uppercase drive letter.
 */
const withUpperDrive = (path: string) => path.replace(/^[a-z]:/, (drive) => drive.toUpperCase());
const projectRoot = withUpperDrive(fileURLToPath(new URL('.', import.meta.url)));
const srcDir = withUpperDrive(fileURLToPath(new URL('./src', import.meta.url)));

export default defineConfig(({ mode }) => {
  // Load all variables (not only VITE_*) for build-time configuration.
  const env = loadEnv(mode, projectRoot, '');

  const { VITE_SITE_URL: siteUrl, API_PROXY_TARGET: proxyTarget = 'http://localhost:5000' } = env;
  if (!siteUrl) {
    throw new Error('VITE_SITE_URL is required. Copy client/.env.example to client/.env.');
  }

  return {
    root: projectRoot,
    plugins: [
      react(),
      tailwindcss(),
      seoFiles({
        siteUrl,
        routes: INDEXABLE_ROUTES,
        allowIndexing: env.SEO_ALLOW_INDEXING === 'true',
      }),
    ],
    resolve: {
      alias: { '@': srcDir },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': { target: proxyTarget, changeOrigin: true },
      },
    },
    preview: {
      port: 4173,
      strictPort: true,
    },
    build: {
      target: 'baseline-widely-available',
      sourcemap: mode !== 'production',
      // Inline only tiny assets; larger images/fonts stay as cacheable hashed files.
      assetsInlineLimit: 2048,
      // No manual vendor chunk groups (build.rolldownOptions.output.codeSplitting.groups):
      // Vite 8 also applies them to the dev dependency pre-bundler. Rolldown's automatic
      // splitting (one chunk per lazy route / dynamic import) is used.
      // The entry chunk (React, React Router, GSAP, Lenis, TanStack Query) is ~190 kB gzip,
      // above Vite's default 500 kB (raw) warning; revisit if it grows past this limit.
      chunkSizeWarningLimit: 600,
    },
  };
});
