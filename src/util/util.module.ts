import { Module } from '@nestjs/common';
import { UtilController } from '@controllers/util.controller';
import { UtilService } from '@services/util.service';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: process.env.NODE_ENV == 'production' ? process.env.REDIS_URL_PROD : process.env.REDIS_URL_DEV,
    }),
  ],
  controllers: [UtilController],
  providers: [UtilService],
})
export class UtilModule {}
