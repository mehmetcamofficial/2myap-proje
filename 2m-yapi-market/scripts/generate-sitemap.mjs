// Generates public/sitemap.xml at build time from VITE_PUBLIC_SITE_URL.
// Never hardcodes a production domain; falls back to the Vercel default.
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = (process.env.VITE_PUBLIC_SITE_URL || 'https://2myapimarket.vercel.app').replace(/\/+$/, '');

const staticPaths = ['', '/hizmetler', '/uygulamalar', '/galeri', '/blog', '/iletisim'];

// Collect service slugs straight from the data source of truth.
const servicesSrc = readFileSync(resolve(root, 'src/data/services.ts'), 'utf8');
const slugs = [...servicesSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => `/${m[1]}`);

const allPaths = [...staticPaths, ...slugs];

const urls = allPaths
  .map((p) => {
    const priority = p === '' ? '1.0' : p.startsWith('/hizmetler') || p.startsWith('/uygulamalar') ? '0.8' : '0.7';
    const changefreq = p === '' ? 'weekly' : 'monthly';
    return `  <url>\n    <loc>${base}${p}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

writeFileSync(
  resolve(root, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`sitemap.xml generated for ${base} (${allPaths.length} urls)`);
