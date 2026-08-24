import { Router, type IRouter } from 'express';
import { db, blogPostsTable } from '@workspace/db';
import { authMiddleware } from '../lib/auth';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();
router.use(authMiddleware);

router.get('/admin/blog', async (_req, res) => {
  const rows = await db.select().from(blogPostsTable).orderBy(blogPostsTable.createdAt);
  res.json(rows);
});

router.get('/admin/blog/:id', async (req, res) => {
  const [row] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, Number(req.params.id))).limit(1);
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.post('/admin/blog', async (req, res) => {
  const [row] = await db.insert(blogPostsTable).values(req.body).returning();
  res.status(201).json(row);
});

router.put('/admin/blog/:id', async (req, res) => {
  const [row] = await db.update(blogPostsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(blogPostsTable.id, Number(req.params.id))).returning();
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.delete('/admin/blog/:id', async (req, res) => {
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

export default router;
