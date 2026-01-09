
import { getTenantId } from 'src/common/tenant/tenant.helper';
import { isSuperAdmin } from 'src/common/tenant/super-admin.helper';

export function tenantCacheKey(key: string): string {
  if (isSuperAdmin()) {
    return `GLOBAL::${key}`;
  }
  return `TENANT::${getTenantId()}::${key}`;
}
