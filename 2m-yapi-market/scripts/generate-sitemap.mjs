// Generates public/sitemap.xml at build time from VITE_PUBLIC_SITE_URL.
// Never hardcodes a production domain; falls back to the Vercel default.
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = (process.env.VITE_PUBLIC_SITE_URL || 'https://2myapimarket.vercel.app').replace(/\/+$/, '');

const staticPaths = ['', '/hizmetler', '/uygulamalar', '/iletisim'];

// Collect service slugs straight from the data source of truth.
const servicesSrc = readFileSync(resolve(root, 'src/data/services.ts'), 'utf8');
const slugs = [...servicesSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => `/${m[1]}`);

const urls = [...staticPaths, ...slugs]
  .map((p) => `  <url><loc>${base}${p}</loc></url>`)
  .join('\n');

writeFileSync(
  resolve(root, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`sitemap.xml generated for ${base} (${staticPaths.length + slugs.length} urls)`);
