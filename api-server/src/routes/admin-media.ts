import { Router, type IRouter } from 'express';
import { db, mediaTable, servicesTable, applicationsTable, galleriesTable, blogPostsTable } from '@workspace/db';
import { authMiddleware } from '../lib/auth';
import { eq, like, or } from 'drizzle-orm';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      cb(new Error('Desteklenmeyen dosya formatı. Yalnızca JPEG, PNG, WebP ve AVIF dosyaları yüklenebilir.'));
      return;
    }
    cb(null, true);
  },
});

const router: IRouter = Router();
router.use(authMiddleware);

router.get('/admin/media', async (req, res) => {
  const search = req.query.search as string | undefined;
  let rows;
  if (search) {
    rows = await db.select().from(mediaTable).where(
      or(like(mediaTable.filename, `%${search}%`), like(mediaTable.altText, `%${search}%`), like(mediaTable.title, `%${search}%`))
    );
  } else {
    rows = await db.select().from(mediaTable);
  }
  res.json(rows);
});

router.get('/admin/media/:id', async (req, res) => {
  const [row] = await db.select().from(mediaTable).where(eq(mediaTable.id, Number(req.params.id))).limit(1);
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

// Upload single image
router.post('/admin/media', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) { res.status(400).json({ error: 'Dosya yüklenmedi' }); return; }

  const ext = extname(file.originalname).toLowerCase();
  const storageKey = `${randomUUID()}${ext}`;

  // In production, save to object storage (S3, Cloudinary, etc.)
  // For now, store metadata in DB and the file URL as a data reference
  const [row] = await db.insert(mediaTable).values({
    filename: file.originalname,
    storageKey,
    mimeType: file.mimetype,
    fileSize: file.size,
    altText: req.body.altText || '',
    title: req.body.title || '',
  }).returning();

  res.status(201).json(row);
});

// Upload multiple images
router.post('/admin/media/batch', upload.array('files', 20), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) { res.status(400).json({ error: 'Dosya yüklenmedi' }); return; }

  const results = [];
  for (const file of files) {
    const ext = extname(file.originalname).toLowerCase();
    const storageKey = `${randomUUID()}${ext}`;
    const [row] = await db.insert(mediaTable).values({
      filename: file.originalname,
      storageKey,
      mimeType: file.mimetype,
      fileSize: file.size,
      altText: '',
      title: '',
    }).returning();
    results.push(row);
  }
  res.status(201).json(results);
});

// Update alt text / title
router.put('/admin/media/:id', async (req, res) => {
  const [row] = await db.update(mediaTable).set({ ...req.body, updatedAt: new Date() }).where(eq(mediaTable.id, Number(req.params.id))).returning();
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

// Delete with usage check
router.delete('/admin/media/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [media] = await db.select().from(mediaTable).where(eq(mediaTable.id, id)).limit(1);
  if (!media) { res.status(404).json({ error: 'Not found' }); return; }

  // Check usage across tables
  const key = media.storageKey;
  const [serviceUsing] = await db.select().from(servicesTable).where(
    or(eq(servicesTable.image, key), eq(servicesTable.applicationImage, key))
  ).limit(1);
  const [appUsing] = await db.select().from(applicationsTable).where(eq(applicationsTable.primaryImage, key)).limit(1);
  const [blogUsing] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.image, key)).limit(1);
  const [galleryUsing] = await db.select().from(galleriesTable).where(eq(galleriesTable.coverImage, key)).limit(1);

  const usages: string[] = [];
  if (serviceUsing) usages.push('hizmet');
  if (appUsing) usages.push('uygulama');
  if (blogUsing) usages.push('blog');
  if (galleryUsing) usages.push('galeri');

  if (usages.length > 0) {
    res.status(409).json({ error: `Bu görsel aktif içerikte kullanılıyor: ${usages.join(', ')}. Önce ilgili içerikten kaldırın.` });
    return;
  }

  await db.delete(mediaTable).where(eq(mediaTable.id, id));
  // In production: also delete from object storage
  res.json({ ok: true });
});

export default router;
