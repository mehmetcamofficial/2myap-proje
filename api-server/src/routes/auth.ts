import { Router, type IRouter } from 'express';
import { db, usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { signToken, comparePassword } from '../lib/auth';

const router: IRouter = Router();

router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email ve şifre gereklidir' });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ error: 'Geçersiz email veya şifre' });
      return;
    }
    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Geçersiz email veya şifre' });
      return;
    }
    const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/admin/logout', (_req, res) => {
  res.clearCookie('admin_token');
  res.json({ ok: true });
});

router.get('/admin/me', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.admin_token;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { verifyToken } = await import('../lib/auth');
  const user = await verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  res.json({ user });
});

export default router;
