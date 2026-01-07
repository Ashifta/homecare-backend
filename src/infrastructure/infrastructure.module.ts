
import { Module } from '@nestjs/common';
import { RedisLockService } from './redis/redis-lock.service';

@Module({
  providers: [RedisLockService],
  exports: [RedisLockService],
})
export class InfrastructureModule {}
