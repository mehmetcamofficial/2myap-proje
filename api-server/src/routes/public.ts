import { Router, type IRouter } from 'express';
import { db, servicesTable, faqsTable, applicationsTable, galleriesTable, galleryImagesTable, navigationTable, settingsTable, blogPostsTable } from '@workspace/db';
import { eq, asc } from 'drizzle-orm';

const router: IRouter = Router();

// GET /api/public/services — published services
router.get('/public/services', async (_req, res) => {
  const rows = await db.select().from(servicesTable).where(eq(servicesTable.enabled, true));
  res.json(rows);
});

// GET /api/public/services/:slug — single published service
router.get('/public/services/:slug', async (req, res) => {
  const [row] = await db.select().from(servicesTable).where(eq(servicesTable.slug, req.params.slug)).limit(1);
  if (!row || !row.enabled) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

// GET /api/public/faqs — published FAQs
router.get('/public/faqs', async (req, res) => {
  const serviceSlug = req.query.service as string | undefined;
  let rows;
  if (serviceSlug) {
    rows = await db.select().from(faqsTable)
      .where(eq(faqsTable.published, true))
      .orderBy(asc(faqsTable.displayOrder));
    // Filter by serviceSlug or null (global)
    rows = rows.filter(r => r.serviceSlug === serviceSlug || !r.serviceSlug);
  } else {
    rows = await db.select().from(faqsTable).where(eq(faqsTable.published, true));
  }
  res.json(rows);
});

// GET /api/public/applications — published applications
router.get('/public/applications', async (_req, res) => {
  const rows = await db.select().from(applicationsTable).where(eq(applicationsTable.published, true));
  res.json(rows);
});

// GET /api/public/applications/:slug — single published application
router.get('/public/applications/:slug', async (req, res) => {
  const [row] = await db.select().from(applicationsTable).where(eq(applicationsTable.slug, req.params.slug)).limit(1);
  if (!row || !row.published) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

// GET /api/public/galleries — published galleries
router.get('/public/galleries', async (_req, res) => {
  const rows = await db.select().from(galleriesTable).where(eq(galleriesTable.published, true));
  res.json(rows);
});

// GET /api/public/galleries/:slug — single gallery with images
router.get('/public/galleries/:slug', async (req, res) => {
  const [gallery] = await db.select().from(galleriesTable).where(eq(galleriesTable.slug, req.params.slug)).limit(1);
  if (!gallery || !gallery.published) { res.status(404).json({ error: 'Not found' }); return; }
  const images = await db.select().from(galleryImagesTable).where(eq(galleryImagesTable.galleryId, gallery.id));
  res.json({ ...gallery, images });
});

// GET /api/public/navigation — published navigation items
router.get('/public/navigation', async (_req, res) => {
  const rows = await db.select().from(navigationTable).where(eq(navigationTable.published, true));
  res.json(rows);
});

// GET /api/public/settings — public settings (safe subset)
router.get('/public/settings', async (_req, res) => {
  const rows = await db.select().from(settingsTable);
  const safeKeys = [
    'business_name', 'business_phone', 'business_whatsapp', 'business_email',
    'business_address', 'business_maps_embed', 'business_maps_directions',
    'business_google_profile', 'service_area', 'opening_hours',
    'whatsapp_default_message', 'hero_headline', 'hero_sub', 'hero_eyebrow',
    'hero_cta_label', 'hero_cta_url', 'hero_enabled',
    'brand_title', 'brand_text', 'brand_image',
    'service_area_heading', 'service_area_text', 'service_area_regions',
    'final_cta_heading', 'final_cta_text', 'final_cta_button',
    'seo_title', 'seo_description', 'seo_og_image',
    'social_instagram', 'social_facebook', 'social_youtube',
  ];
  const map: Record<string, string> = {};
  rows.forEach(r => { if (safeKeys.includes(r.key)) map[r.key] = r.value; });
  res.json(map);
});

// GET /api/public/blog — published blog posts
router.get('/public/blog', async (_req, res) => {
  const rows = await db.select().from(blogPostsTable).where(eq(blogPostsTable.published, true));
  res.json(rows);
});

// GET /api/public/blog/:slug — single published blog post
router.get('/public/blog/:slug', async (req, res) => {
  const [row] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, req.params.slug)).limit(1);
  if (!row || !row.published) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

// GET /api/public/site — composed homepage data (reduces client requests)
router.get('/public/site', async (_req, res) => {
  const [services, faqs, applications, navigation, settingsRows] = await Promise.all([
    db.select().from(servicesTable).where(eq(servicesTable.enabled, true)),
    db.select().from(faqsTable).where(eq(faqsTable.published, true)),
    db.select().from(applicationsTable).where(eq(applicationsTable.published, true)),
    db.select().from(navigationTable).where(eq(navigationTable.published, true)),
    db.select().from(settingsTable),
  ]);

  const settings: Record<string, string> = {};
  settingsRows.forEach(r => { settings[r.key] = r.value; });

  res.json({ services, faqs, applications, navigation, settings });
});

export default router;
