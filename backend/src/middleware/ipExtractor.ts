import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Middleware для извлечения реального IP-адреса клиента
 * Приоритет: X-Forwarded-For → X-Real-IP → req.ip
 */
export const extractClientIP: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  // Проверяем X-Forwarded-For (может содержать цепочку IP)
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    (req as any).clientIP = ips.split(',')[0].trim();
    return next();
  }

  // Проверяем X-Real-IP
  const realIP = req.headers['x-real-ip'];
  if (realIP) {
    (req as any).clientIP = Array.isArray(realIP) ? realIP[0] : realIP;
    return next();
  }

  // Используем req.ip как fallback
  (req as any).clientIP = (req.ip || (req.connection as any).remoteAddress || 'unknown');
  next();
};