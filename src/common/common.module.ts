import { Global, Module } from '@nestjs/common';

import { RequestLoggerMiddleware } from '@middlewares/request-logger.middleware';

@Global()
@Module({
  providers: [RequestLoggerMiddleware],
  exports: [RequestLoggerMiddleware],
})
export class CommonModule {}
