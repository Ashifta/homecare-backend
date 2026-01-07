
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisLockService {
  private readonly logger = new Logger(RedisLockService.name);
  private locks = new Map<string, NodeJS.Timeout>();

  async lock(key: string, ttlMs = 300000): Promise<boolean> {
    try {
      if (this.locks.has(key)) return false;
      const timer = setTimeout(() => this.locks.delete(key), ttlMs);
      this.locks.set(key, timer);
      this.logger.log(`Lock acquired: ${key}`);
      return true;
    } catch (error) {
      this.logger.error('Lock failed', error);
      throw error;
    }
  }

  async unlock(key: string) {
    try {
      const timer = this.locks.get(key);
      if (timer) clearTimeout(timer);
      this.locks.delete(key);
      this.logger.log(`Lock released: ${key}`);
    } catch (error) {
      this.logger.error('Unlock failed', error);
      throw error;
    }
  }
}
