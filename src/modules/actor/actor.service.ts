// src/modules/actor/actor.service.ts
import { Injectable } from '@nestjs/common';
import { ActorRepository } from './actor.repository';
import { CreateActorDto } from './dto/create-actor.dto';
import { CentralAssignmentService } from '../central-assignment/central-assignment.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ActorService {
  constructor(
    private readonly repo: ActorRepository,
    private readonly centralService: CentralAssignmentService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreateActorDto) {
    const actor = await this.repo.createActor(dto);

    if (actor.type === 'PROVIDER') {
      await this.centralService.assignProvider(actor.id, actor.tenantId);
    }

    await this.audit.log({
      action: 'ACTOR_CREATED',
      entityId: actor.id,
      performedBy: 'SYSTEM',
    });

    return actor;
  }
}
