// src/infrastructure/redis/redis.service.ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client = new Redis();

  async getNumber(key: string): Promise<number> {
    const val = await this.client.get(key);
    return val ? Number(val) : 0;
  }

  async increment(key: string) {
    return this.client.incr(key);
  }

  async set(key: string, value: string | number) {
    return this.client.set(key, value.toString());
  }
}
