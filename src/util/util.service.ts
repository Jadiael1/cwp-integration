import { Inject, Injectable } from '@nestjs/common';
import type { RedisClient } from '@providers/redis.provider';
import { REDIS_CLIENT } from '@providers/redis.provider';

@Injectable()
export class UtilService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: RedisClient,
  ) {}

  getEnvironment(): { env: string | undefined } {
    return { env: process.env.NODE_ENV };
  }

  getHealth(): { health: string } {
    return { health: 'Healthy' };
  }

  async setKeyValue(key: string, value: string): Promise<string> {
    return this.redis.set(key, value);
  }

  async getKeyValue(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  getNodeVersion(): { node_version: string } {
    return { node_version: process.version };
  }
}
