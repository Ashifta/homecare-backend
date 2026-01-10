import { ForbiddenException } from '@nestjs/common';
import { tenantStorage } from './tenant.context';

export function getTenantId(): string {
  const store = tenantStorage.getStore();

  if (!store?.tenantId) {
    throw new Error('TenantId not found in request context');
  }

  return store.tenantId;
}

export function getRole(): string | undefined {
  return tenantStorage.getStore()?.role;
}

export function requireTenant(): string {
  const tenantId = getTenantId();
  if (!tenantId) {
    throw new ForbiddenException('Tenant context missing');
  }
  return tenantId;
}

export function requireRole(...allowedRoles: string[]): string {
  console.log("................")
  const role = getRole();
  console.log("........test....")
  if (!role || !allowedRoles.includes(role)) {
    throw new ForbiddenException(
      `Role ${role ?? 'UNKNOWN'} not allowed`,
    );
  }
  return role;
}
