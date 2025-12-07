import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ErrorResponse = Record<string, unknown>;

interface RequestWithId extends Request {
  id?: string;
}

@Catch()
export class ExceptionLoggerFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<RequestWithId>();
    const res = ctx.getResponse<Response>();

    const { statusCode, errorResponse } =
      this.getExceptionAttributes(exception);
    const logMessage = this.getLogMessage(req, exception);

    this.logger.error(logMessage);

    res.status(statusCode).json(errorResponse);
  }

  private getLogMessage(req: RequestWithId, exception: unknown): string {
    const { originalUrl, method } = req;
    const id = req.id ?? 'unknown-id';

    const { statusCode, errorResponse, isHttpException, stack } =
      this.getExceptionAttributes(exception);

    let logMessage = `${id} ${method} ${originalUrl} ${statusCode}`;

    if (isHttpException && errorResponse) {
      logMessage += `\n${JSON.stringify(errorResponse, null, 2)}`;
    }

    if (!isHttpException && stack) {
      logMessage += `\n${stack}`;
    }

    return logMessage;
  }

  private isHttpException(exception: unknown): exception is HttpException {
    return exception instanceof HttpException;
  }

  private getExceptionAttributes(exception: unknown): {
    statusCode: number;
    stack?: string;
    errorResponse: ErrorResponse;
    isHttpException: boolean;
  } {
    if (this.isHttpException(exception)) {
      const statusCode = exception.getStatus();

      const response = exception.getResponse();
      let errorResponse: ErrorResponse;

      if (typeof response === 'string') {
        errorResponse = { message: response };
      } else if (response && typeof response === 'object') {
        errorResponse = response as ErrorResponse;
      } else {
        errorResponse = { message: 'Unknown error response' };
      }

      const stack = exception.stack;

      return {
        statusCode,
        stack,
        errorResponse,
        isHttpException: true,
      };
    }

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    let stack: string | undefined;
    let message = 'Something went wrong';

    if (exception instanceof Error) {
      stack = exception.stack;
      if (exception.message) {
        message = exception.message;
      }
    }

    const errorResponse: ErrorResponse = {
      platform: 'unknown',
      message,
    };

    return {
      statusCode,
      stack,
      errorResponse,
      isHttpException: false,
    };
  }
}
