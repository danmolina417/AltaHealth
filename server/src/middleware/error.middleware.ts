import type { ErrorRequestHandler, RequestHandler } from 'express';

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new HttpError(404, 'Not Found'));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  if (statusCode >= 500) {
    req.log?.error({ err }, 'Unhandled error');
  }
  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : err.message,
  });
};
