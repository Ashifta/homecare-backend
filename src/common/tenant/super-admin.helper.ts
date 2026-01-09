
import { tenantStorage } from './tenant.context';

export function isSuperAdmin(): boolean {
  const store = tenantStorage.getStore();
  return !!store?.isSuperAdmin;
}
