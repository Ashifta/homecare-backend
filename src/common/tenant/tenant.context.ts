import { AsyncLocalStorage } from 'async_hooks';

type TenantStore = {
  tenantId: string;
};

export const tenantStorage = new AsyncLocalStorage<TenantStore>();

export function getTenantId(): string {
  const store = tenantStorage.getStore();
  if (!store?.tenantId) {
    throw new Error('Tenant context not available');
  }
  return store.tenantId;
}
