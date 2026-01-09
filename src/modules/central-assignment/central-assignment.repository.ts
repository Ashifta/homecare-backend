// src/modules/central-assignment/central-assignment.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CentralAssignmentEntity } from './entities/central-assignment.entity';
import { BaseTenantRepository } from 'src/common/database/base-tenant.repository';
import { getTenantId } from 'src/common/tenant/tenant.helper';

@Injectable()
export class CentralAssignmentRepository
  extends BaseTenantRepository<CentralAssignmentEntity> {

  constructor(dataSource: DataSource) {
    super(CentralAssignmentEntity, dataSource.createEntityManager());
  }

  /**
   * Find active assignments for current tenant
   */
  findActive() {
    return this.find({
      where: { status: 'ACTIVE' },
      order: { providerCount: 'ASC' },
    });
  }

  /**
   * Increment provider count (tenant-safe)
   */
  async incrementCount(id: string) {
    await this.increment(
      { id, tenantId: getTenantId() },
      'providerCount',
      1,
    );
  }

  /**
   * Create assignment (tenant injected automatically)
   */
  async createAssignment(payload: Partial<CentralAssignmentEntity>) {
    const entity = this.createForTenant(payload);
    return this.save(entity);
  }
}
