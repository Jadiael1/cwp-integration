import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

type AppRequest = Request<any, any, unknown> & {
  id?: string;
};

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly startLogger = new Logger('Start');
  private readonly endLogger = new Logger('End');

  use(req: AppRequest, res: Response, next: NextFunction): void {
    const id = uuid();
    req.id = id;

    const { method, originalUrl, body } = req;

    let logMessage = `${id} ${method} ${originalUrl}`;

    const formattedBody = JSON.stringify(body, null, 4);
    if (formattedBody !== '{}') {
      logMessage += `\n${formattedBody}`;
    }

    this.startLogger.log(logMessage);

    res.on('finish', () => {
      const { statusCode } = res;
      if (statusCode < 400) {
        this.endLogger.log(`${id} ${method} ${originalUrl} ${statusCode}`);
      }
    });

    next();
  }
}
