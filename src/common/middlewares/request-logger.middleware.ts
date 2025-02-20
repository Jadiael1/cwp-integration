import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private startlogger = new Logger('Start');
  private endLogger = new Logger('End');

  use(req: Request, res: Response, next: NextFunction) {
    const id = uuid();
    req['id'] = id;

    const { method, originalUrl, body } = req;
    let logMessage = `${id} ${method} ${originalUrl}`;

    const formattedBody = JSON.stringify(body, null, 4);
    if (formattedBody !== '{}') {
      logMessage += `\n${formattedBody}`;
    }

    this.startlogger.log(logMessage);

    res.on('finish', () => {
      const { statusCode } = res;
      if (statusCode < 400) {
        this.endLogger.log(`${id} ${method} ${originalUrl} ${statusCode}`);
      }
    });

    next();
  }
}
