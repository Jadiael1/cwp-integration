import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExceptionLoggerFilter implements ExceptionFilter {
  private logger = new Logger('Exception');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const { statusCode, errorResponse } = this.getExceptionAttributes(exception);
    const logMessage = this.getLogMessage(req, exception);

    this.logger.error(logMessage);

    res.status(statusCode).json(errorResponse);
  }

  private getLogMessage(req: Request, exception: any): string {
    const isHttp = this.isHttpException(exception);
    const { originalUrl, method } = req;
    const id = req['id'];
    const { statusCode, errorResponse, stack } = this.getExceptionAttributes(exception);

    let logMessage = `${id} ${method} ${originalUrl} ${statusCode}`;

    if (isHttp && errorResponse) {
      logMessage += `\n${JSON.stringify(errorResponse, null, 2)}`;
    }

    if (!isHttp) {
      logMessage += `\n${stack}`;
    }

    return logMessage;
  }

  private isHttpException(exception: any): boolean {
    return exception instanceof HttpException;
  }

  private getExceptionAttributes(exception: any): { statusCode: number; stack: any; errorResponse: boolean } {
    const isHttp = this.isHttpException(exception);
    const statusCode = isHttp ? exception.getStatus() : 500;
    const errorResponse = isHttp
      ? exception.response.message
      : { platform: 'unknown', message: 'Something went worng' };
    const stack = exception.stack;
    return { statusCode, stack, errorResponse };
  }
}
