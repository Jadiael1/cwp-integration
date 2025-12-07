import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
export type RedisClient = Redis;

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService): RedisClient => {
    const url =
      configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
    return new Redis(url);
  },
  inject: [ConfigService],
};
