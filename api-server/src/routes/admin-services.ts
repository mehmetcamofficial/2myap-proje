import { Router, type IRouter } from 'express';
import { db, servicesTable } from '@workspace/db';
import { authMiddleware } from '../lib/auth';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();
router.use(authMiddleware);

router.get('/admin/services', async (_req, res) => {
  const rows = await db.select().from(servicesTable);
  res.json(rows);
});

router.get('/admin/services/:id', async (req, res) => {
  const [row] = await db.select().from(servicesTable).where(eq(servicesTable.id, Number(req.params.id))).limit(1);
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.post('/admin/services', async (req, res) => {
  const [row] = await db.insert(servicesTable).values(req.body).returning();
  res.status(201).json(row);
});

router.put('/admin/services/:id', async (req, res) => {
  const [row] = await db.update(servicesTable).set({ ...req.body, updatedAt: new Date() }).where(eq(servicesTable.id, Number(req.params.id))).returning();
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.delete('/admin/services/:id', async (req, res) => {
  await db.delete(servicesTable).where(eq(servicesTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

export default router;
