import { Router, type IRouter } from 'express';
import {
  db,
  interactiveModulesTable,
} from '@workspace/db';
import { authMiddleware } from '../lib/auth';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();
router.use(authMiddleware);

router.get('/admin/interactive-modules', async (req, res) => {
  const page = req.query.page as string | undefined;
  const rows = page
    ? await db.select().from(interactiveModulesTable).where(eq(interactiveModulesTable.page, page)).orderBy(interactiveModulesTable.sortOrder)
    : await db.select().from(interactiveModulesTable).orderBy(interactiveModulesTable.sortOrder);
  res.json(rows);
});

router.post('/admin/interactive-modules', async (req, res) => {
  const [mod] = await db.insert(interactiveModulesTable).values(req.body).returning();
  res.status(201).json(mod);
});

router.put('/admin/interactive-modules/:id', async (req, res) => {
  const [mod] = await db.update(interactiveModulesTable)
    .set({ ...req.body, updatedAt: new Date() })
    .where(eq(interactiveModulesTable.id, req.params.id))
    .returning();
  res.json(mod);
});

router.delete('/admin/interactive-modules/:id', async (req, res) => {
  await db.delete(interactiveModulesTable).where(eq(interactiveModulesTable.id, req.params.id));
  res.json({ ok: true });
});

export default router;
