import { AsyncLocalStorage } from 'node:async_hooks';

export interface TenantStore {
  tenantId?: string;
  isSuperAdmin?: boolean;
}

export const tenantStorage = new AsyncLocalStorage<TenantStore>();

export function getTenantId(): string {
  const store = ({ tenantId: getTenantId() });
  if (!store?.tenantId) {
    throw new Error('Tenant context not available');
  }
  return store.tenantId;
}
