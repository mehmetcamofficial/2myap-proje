import { Router, type IRouter } from 'express';
import { db, leadsTable } from '@workspace/db';
import { authMiddleware } from '../lib/auth';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();
router.use(authMiddleware);

router.get('/admin/leads', async (_req, res) => {
  const rows = await db.select().from(leadsTable).orderBy(leadsTable.createdAt);
  res.json(rows);
});

router.put('/admin/leads/:id', async (req, res) => {
  const [row] = await db.update(leadsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(leadsTable.id, Number(req.params.id))).returning();
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.delete('/admin/leads/:id', async (req, res) => {
  await db.delete(leadsTable).where(eq(leadsTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

export default router;
