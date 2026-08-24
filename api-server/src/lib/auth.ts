import { type Request, type Response, type NextFunction } from 'express';

const API_TOKEN = process.env.ADMIN_API_TOKEN || 'dev-token-change-in-production';

export interface AuthUser {
  id: string;
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

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.admin_token;

  if (!token || token !== API_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  req.user = { id: '1', email: 'admin@2myapi.com', name: 'Admin', role: 'admin' };
  next();
}
