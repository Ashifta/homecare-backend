
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity } from './audit-log.entity';
import { getTenantId } from 'src/common/tenant/tenant.helper';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly repo: Repository<AuditLogEntity>,
  ) {}

  async log(params: {
    actorId: string;
    action: string;
    entity: string;
    entityId: string;
    metadata?: Record<string, any>;
  }) {
    const entry = this.repo.create({
      tenantId: getTenantId(),
      ...params,
    });
    await this.repo.save(entry);
  }
}
