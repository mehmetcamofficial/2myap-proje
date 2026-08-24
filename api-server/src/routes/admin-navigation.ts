import { Router, type IRouter } from 'express';
import { db, navigationTable } from '@workspace/db';
import { authMiddleware } from '../lib/auth';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();
router.use(authMiddleware);

router.get('/admin/navigation', async (_req, res) => {
  const rows = await db.select().from(navigationTable);
  res.json(rows);
});

router.post('/admin/navigation', async (req, res) => {
  const [row] = await db.insert(navigationTable).values(req.body).returning();
  res.status(201).json(row);
});

router.put('/admin/navigation/:id', async (req, res) => {
  const [row] = await db.update(navigationTable).set({ ...req.body, updatedAt: new Date() }).where(eq(navigationTable.id, Number(req.params.id))).returning();
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.delete('/admin/navigation/:id', async (req, res) => {
  // Protect critical navigation items from destructive deletion
  const [item] = await db.select().from(navigationTable).where(eq(navigationTable.id, Number(req.params.id))).limit(1);
  if (!item) { res.status(404).json({ error: 'Not found' }); return; }
  // Do not allow deletion of top-level header items (structural navigation)
  if (item.type === 'header' && !item.parentId) {
    res.status(400).json({ error: 'Ana menü öğeleri silinemez. Yayınlamayı kaldırabilirsiniz.' });
    return;
  }
  await db.delete(navigationTable).where(eq(navigationTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

export default router;
