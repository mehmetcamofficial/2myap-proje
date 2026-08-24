import { Router, type IRouter } from 'express';
import { db, applicationsTable } from '@workspace/db';
import { authMiddleware } from '../lib/auth';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();
router.use(authMiddleware);

router.get('/admin/applications', async (_req, res) => {
  const rows = await db.select().from(applicationsTable);
  res.json(rows);
});

router.get('/admin/applications/:id', async (req, res) => {
  const [row] = await db.select().from(applicationsTable).where(eq(applicationsTable.id, Number(req.params.id))).limit(1);
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.post('/admin/applications', async (req, res) => {
  const [row] = await db.insert(applicationsTable).values(req.body).returning();
  res.status(201).json(row);
});

router.put('/admin/applications/:id', async (req, res) => {
  const [row] = await db.update(applicationsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(applicationsTable.id, Number(req.params.id))).returning();
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.delete('/admin/applications/:id', async (req, res) => {
  await db.delete(applicationsTable).where(eq(applicationsTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

export default router;
