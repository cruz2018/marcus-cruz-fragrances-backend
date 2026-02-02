import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const start = Date.now();
    res.on('finish', () => {
      const durationMs = Date.now() - start;
      const log = {
        level: 'info',
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
      };
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(log));
    });
    next();
  }
}
