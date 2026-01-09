// src/modules/actor/actor.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ActorEntity } from './entities/actor.entity';
import { BaseTenantRepository } from 'src/common/database/base-tenant.repository';

@Injectable()
export class ActorRepository extends BaseTenantRepository<ActorEntity> {
  constructor(dataSource: DataSource) {
    super(ActorEntity, dataSource.createEntityManager());
  }

  /**
   * Tenant-implicit creation
   * tenantId is injected automatically
   */
  async createActor(payload: Partial<ActorEntity>): Promise<ActorEntity> {
    const actor = this.createForTenant(payload);
    return this.save(actor);
  }

  /**
   * Explicit tenant creation
   * Intended ONLY for super-admin / bootstrap flows
   */
  async createCentral(tenantId: string): Promise<ActorEntity> {
    const central = this.create({
      tenantId,
      type: 'CENTRAL',
      subType: 'CENTRAL_OPERATOR',
    });
    return this.save(central);
  }
}
