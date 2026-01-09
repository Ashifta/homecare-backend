
import { Module } from '@nestjs/common';
import { TenantCacheService } from './tenant-cache.service';

@Module({
  providers: [TenantCacheService],
  exports: [TenantCacheService],
})
export class TenantCacheModule {}
