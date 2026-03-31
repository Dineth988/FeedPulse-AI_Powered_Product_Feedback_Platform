import { Request, Response, NextFunction } from 'express';
import type { request } from 'node:http';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    success: false,
    error: 'An unexpected error occurred.',
  });
}