import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
@Injectable()
export class UtilService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  getEnvironment() {
    return { env: process.env.NODE_ENV };
  }

  getHealth() {
    return { health: 'Healthy' };
  }

  async setKeyValue(key: string, value: string): Promise<string> {
    return await this.redis.set(key, value);
  }

  async getKeyValue(key: string): Promise<string> {
    return await this.redis.get(key);
  }

  getNodeVersion() {
    return { node_version: process.version };
  }
}
