// src/modules/audit/audit.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  async log(payload: any) {
    console.log('[AUDIT]', payload);
  }
}
