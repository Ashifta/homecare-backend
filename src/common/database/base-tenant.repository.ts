import { Repository, FindManyOptions, FindOneOptions, DeepPartial } from 'typeorm';
import { getTenantId } from 'src/common/tenant/tenant.helper';
import { isSuperAdmin } from 'src/common/tenant/super-admin.helper';

export class BaseTenantRepository<T extends { tenantId: string }>
  extends Repository<T> {

  protected tenantWhere(extraWhere: any = {}) {
    if (isSuperAdmin()) {
      return extraWhere;
    }

    if (Array.isArray(extraWhere)) {
      return extraWhere.map((w) => ({
        tenantId: getTenantId(),
        ...w,
      }));
    }

    return { tenantId: getTenantId(), ...extraWhere };
  }

  find(options: FindManyOptions<T> = {}) {
    return super.find({
      ...options,
      where: this.tenantWhere(options.where),
    });
  }

  findOne(options: FindOneOptions<T>) {
    return super.findOne({
      ...options,
      where: this.tenantWhere(options.where),
    });
  }

  /**
   * ✅ SAFE tenant-aware create
   * ❌ Does NOT override Repository.create()
   */
  createForTenant(entity: DeepPartial<T>): T {
    if (isSuperAdmin()) {
      return super.create(entity);
    }

    return super.create({
      ...entity,
      tenantId: getTenantId(),
    } as DeepPartial<T>);
  }
}
