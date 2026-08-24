import { type Request, type Response, type NextFunction } from 'express';
import { SignJWT, jwtVerify } from 'jose';
import { db, usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-in-production');
const TOKEN_EXPIRY = '7d';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function signToken(user: AuthUser): Promise<string> {
  return new SignJWT({ sub: String(user.id), email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.sub || !payload.email || !payload.name || !payload.role) return null;
    return { id: Number(payload.sub), email: payload.email as string, name: payload.name as string, role: payload.role as string };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.admin_token;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const user = await verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  req.user = user;
  next();
}
