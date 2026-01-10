import { getTenantId } from './../../common/tenant';

export function tenantCacheKey(key: string): string {
  return `TENANT::${getTenantId()}::${key}`;
}
