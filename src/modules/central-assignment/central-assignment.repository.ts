// src/modules/central-assignment/central-assignment.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CentralAssignmentEntity } from './entities/central-assignment.entity';

@Injectable()
export class CentralAssignmentRepository extends Repository<CentralAssignmentEntity> {
  constructor(dataSource: DataSource) {
    super(CentralAssignmentEntity, dataSource.createEntityManager());
  }

  findActiveByTenant(tenantId: string) {
    return this.find({
      where: { tenantId, status: 'ACTIVE' },
      order: { providerCount: 'ASC' },
    });
  }

  async incrementCount(id: string) {
    await this.increment({ id }, 'providerCount', 1);
  }

  async createAssignment(payload: Partial<CentralAssignmentEntity>) {
    const entity = this.create(payload);
    return this.save(entity);
  }
}
