import { ForbiddenException } from '@nestjs/common';

export interface TenantContext {
  tenantId: string;
  actorId: string;
  actorType: 'ADMIN' | 'PROVIDER' | 'PATIENT' | 'SYSTEM';
}

export abstract class BaseService<T extends { tenantId?: string }> {
  protected forceTenant(ctx: TenantContext) {
    return { tenantId: ctx.tenantId };
  }

  protected enforceTenant(entity: T, ctx: TenantContext) {
    if (entity.tenantId && entity.tenantId !== ctx.tenantId) {
      throw new ForbiddenException('Tenant violation');
    }
  }

  protected enforceOwner(ownerId: string, ctx: TenantContext) {
    if (ownerId !== ctx.actorId) {
      throw new ForbiddenException('Not owner');
    }
  }
}
