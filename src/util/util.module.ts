import { Module } from '@nestjs/common';
import { UtilController } from '@controllers/util.controller';
import { UtilService } from '@services/util.service';
import { redisProvider } from '@providers/redis.provider';

@Module({
  imports: [],
  controllers: [UtilController],
  providers: [UtilService, redisProvider],
  exports: [redisProvider],
})
export class UtilModule {}
