import { Router, type IRouter } from 'express';
import { db, usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { signToken, comparePassword, setAuthCookie, clearAuthCookie, extractToken, verifyToken, checkLoginRateLimit } from '../lib/auth';

const router: IRouter = Router();

router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'E-posta ve şifre gereklidir' });
      return;
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkLoginRateLimit(ip)) {
      res.status(429).json({ error: 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.' });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      // Generic error — do not reveal whether email exists
      res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
      return;
    }
    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
      return;
    }
    const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    setAuthCookie(res, token);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    req.log?.error?.({ err }, 'Login error');
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/admin/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get('/admin/me', async (req, res) => {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const user = await verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  res.json({ user });
});

// Password change
router.put('/admin/change-password', async (req, res) => {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const user = await verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Mevcut şifre ve yeni şifre gereklidir' });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: 'Yeni şifre en az 8 karakter olmalıdır' });
    return;
  }

  const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.id, user.id)).limit(1);
  if (!dbUser) {
    res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    return;
  }

  const valid = await comparePassword(currentPassword, dbUser.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Mevcut şifre hatalı' });
    return;
  }

  const bcrypt = await import('bcrypt');
  const newHash = await bcrypt.hash(newPassword, 12);
  await db.update(usersTable).set({ passwordHash: newHash }).where(eq(usersTable.id, user.id));

  res.json({ ok: true, message: 'Şifre başarıyla güncellendi' });
});

export default router;
