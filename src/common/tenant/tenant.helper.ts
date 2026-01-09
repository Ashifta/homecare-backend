import { tenantStorage } from './tenant.context';

export function getTenantId(): string {
  const store = tenantStorage.getStore();

  if (!store?.tenantId) {
    throw new Error('TenantId not found in request context');
  }

  return store.tenantId;
}