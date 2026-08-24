import { Router, type IRouter } from 'express';
import { db, galleriesTable, galleryImagesTable } from '@workspace/db';
import { authMiddleware } from '../lib/auth';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();
router.use(authMiddleware);

router.get('/admin/galleries', async (_req, res) => {
  const rows = await db.select().from(galleriesTable);
  res.json(rows);
});

router.get('/admin/galleries/:id', async (req, res) => {
  const [gallery] = await db.select().from(galleriesTable).where(eq(galleriesTable.id, Number(req.params.id))).limit(1);
  if (!gallery) { res.status(404).json({ error: 'Not found' }); return; }
  const images = await db.select().from(galleryImagesTable).where(eq(galleryImagesTable.galleryId, gallery.id));
  res.json({ ...gallery, images });
});

router.post('/admin/galleries', async (req, res) => {
  const { images, ...galleryData } = req.body;
  const [gallery] = await db.insert(galleriesTable).values(galleryData).returning();
  if (images && Array.isArray(images)) {
    for (const img of images) {
      await db.insert(galleryImagesTable).values({ ...img, galleryId: gallery.id });
    }
  }
  res.status(201).json(gallery);
});

router.put('/admin/galleries/:id', async (req, res) => {
  const { images, ...galleryData } = req.body;
  const [gallery] = await db.update(galleriesTable).set({ ...galleryData, updatedAt: new Date() }).where(eq(galleriesTable.id, Number(req.params.id))).returning();
  if (!gallery) { res.status(404).json({ error: 'Not found' }); return; }
  // Replace images if provided
  if (images && Array.isArray(images)) {
    await db.delete(galleryImagesTable).where(eq(galleryImagesTable.galleryId, gallery.id));
    for (const img of images) {
      await db.insert(galleryImagesTable).values({ ...img, galleryId: gallery.id });
    }
  }
  res.json(gallery);
});

router.delete('/admin/galleries/:id', async (req, res) => {
  await db.delete(galleryImagesTable).where(eq(galleryImagesTable.galleryId, Number(req.params.id)));
  await db.delete(galleriesTable).where(eq(galleriesTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

// Gallery image management
router.post('/admin/galleries/:id/images', async (req, res) => {
  const [image] = await db.insert(galleryImagesTable).values({ ...req.body, galleryId: Number(req.params.id) }).returning();
  res.status(201).json(image);
});

router.delete('/admin/galleries/:galleryId/images/:imageId', async (req, res) => {
  await db.delete(galleryImagesTable).where(eq(galleryImagesTable.id, Number(req.params.imageId)));
  res.json({ ok: true });
});

export default router;
