import { Router, type IRouter } from 'express';
import { db, faqsTable } from '@workspace/db';
import { authMiddleware } from '../lib/auth';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();
router.use(authMiddleware);

router.get('/admin/faqs', async (_req, res) => {
  const rows = await db.select().from(faqsTable);
  res.json(rows);
});

router.get('/admin/faqs/:id', async (req, res) => {
  const [row] = await db.select().from(faqsTable).where(eq(faqsTable.id, Number(req.params.id))).limit(1);
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.post('/admin/faqs', async (req, res) => {
  const [row] = await db.insert(faqsTable).values(req.body).returning();
  res.status(201).json(row);
});

router.put('/admin/faqs/:id', async (req, res) => {
  const [row] = await db.update(faqsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(faqsTable.id, Number(req.params.id))).returning();
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.delete('/admin/faqs/:id', async (req, res) => {
  await db.delete(faqsTable).where(eq(faqsTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

export default router;
