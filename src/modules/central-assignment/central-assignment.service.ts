// src/modules/central-assignment/central-assignment.service.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { CentralAssignmentRepository } from './central-assignment.repository';
import { ActorRepository } from '../actor/actor.repository';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class CentralAssignmentService {
  private readonly MAX_PROVIDER = 30;

  constructor(
    private readonly redis: RedisService,
    private readonly assignmentRepo: CentralAssignmentRepository,
    private readonly actorRepo: ActorRepository,
    private readonly audit: AuditService,
  ) {}

  async assignProvider(providerId: string, tenantId: string) {
    const centrals = await this.assignmentRepo.findActiveByTenant(tenantId);

    for (const central of centrals) {
      const key = `central:load:${tenantId}:${central.centralActorId}`;
      const load = await this.redis.getNumber(key);

      if (load < this.MAX_PROVIDER) {
        await this.redis.increment(key);
        await this.redis.set(`central:provider:${providerId}`, central.centralActorId);
        await this.assignmentRepo.incrementCount(central.id);

        await this.audit.log({
          action: 'PROVIDER_ASSIGNED',
          entityId: providerId,
          performedBy: central.centralActorId,
        });

        return central.centralActorId;
      }
    }

    return this.createNewCentral(providerId, tenantId);
  }

  private async createNewCentral(providerId: string, tenantId: string) {
    const central = await this.actorRepo.createCentral(tenantId);

    await this.assignmentRepo.createAssignment({
      tenantId,
      centralActorId: central.id,
      providerCount: 1,
    });

    await this.redis.set(`central:load:${tenantId}:${central.id}`, 1);
    await this.redis.set(`central:provider:${providerId}`, central.id);

    return central.id;
  }
}
