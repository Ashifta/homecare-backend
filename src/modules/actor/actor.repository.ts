// src/modules/actor/actor.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ActorEntity } from './entities/actor.entity';

@Injectable()
export class ActorRepository extends Repository<ActorEntity> {
  constructor(dataSource: DataSource) {
    super(ActorEntity, dataSource.createEntityManager());
  }

  async createActor(payload: Partial<ActorEntity>): Promise<ActorEntity> {
    const actor = this.create(payload);
    return this.save(actor);
  }

  async createCentral(tenantId: string): Promise<ActorEntity> {
    const central = this.create({
      tenantId,
      type: 'CENTRAL',
      subType: 'CENTRAL_OPERATOR',
    });
    return this.save(central);
  }
}
