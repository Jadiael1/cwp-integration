import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UtilModule } from '@modules/util.module';
import { CommonModule } from '@modules/common.module';
import { RequestLoggerMiddleware } from '@middlewares/request-logger.middleware';
import { AccountModule } from '@modules/account.module';

import { queueConfig, bullBoardConfig } from '@services/config.service';

@Module({
  imports: [bullBoardConfig, queueConfig, UtilModule, CommonModule, AccountModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).exclude({ path: 'queues/(.*)', method: RequestMethod.ALL }).forRoutes('*');
  }
}
