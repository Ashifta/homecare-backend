import { Repository, FindManyOptions, FindOneOptions, DeepPartial } from 'typeorm';
import { getTenantId } from 'src/common/tenant/tenant.helper';

export class BaseTenantRepository<T extends { tenantId: string }>
  extends Repository<T> {

  protected tenantWhere(extraWhere: any = {}) {
    if (!extraWhere) {
      return { tenantId: getTenantId() };
    }

    if (Array.isArray(extraWhere)) {
      return extraWhere.map((w) => ({
        tenantId: getTenantId(),
        ...w,
      }));
    }

    return {
      tenantId: getTenantId(),
      ...extraWhere,
    };
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

  createForTenant(entity: DeepPartial<T>): T {
    return super.create({
      ...entity,
      tenantId: getTenantId(),
    } as DeepPartial<T>);
  }
}
