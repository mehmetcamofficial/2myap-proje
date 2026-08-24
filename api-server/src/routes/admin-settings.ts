import { Router, type IRouter } from 'express';
import { db, settingsTable } from '@workspace/db';
import { authMiddleware } from '../lib/auth';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();
router.use(authMiddleware);

router.get('/admin/settings', async (_req, res) => {
  const rows = await db.select().from(settingsTable);
  res.json(rows);
});

router.put('/admin/settings/:key', async (req, res) => {
  const existing = await db.select().from(settingsTable).where(eq(settingsTable.key, req.params.key)).limit(1);
  if (existing.length === 0) {
    const [row] = await db.insert(settingsTable).values({ key: req.params.key, value: req.body.value }).returning();
    res.json(row);
  } else {
    const [row] = await db.update(settingsTable).set({ value: req.body.value, updatedAt: new Date() }).where(eq(settingsTable.key, req.params.key)).returning();
    res.json(row);
  }
});

export default router;
