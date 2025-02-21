import { Module } from '@nestjs/common';
import { UtilController } from '@controllers/util.controller';
import { UtilService } from '@services/util.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UtilController],
  providers: [UtilService],
})
export class UtilModule {}
