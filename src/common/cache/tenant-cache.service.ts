
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { tenantCacheKey } from './tenant-cache.helper';

@Injectable()
export class TenantCacheService {
  private redis = new Redis();

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(tenantCacheKey(key));
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttlSeconds = 60): Promise<void> {
    await this.redis.set(
      tenantCacheKey(key),
      JSON.stringify(value),
      'EX',
      ttlSeconds,
    );
  }

  async del(key: string): Promise<void> {
    await this.redis.del(tenantCacheKey(key));
  }
}
