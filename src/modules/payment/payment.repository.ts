import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { BaseTenantRepository } from 'src/common/database/base-tenant.repository';

@Injectable()
export class PaymentRepository extends BaseTenantRepository<Payment> {
  constructor(dataSource: DataSource) {
    super(Payment, dataSource.createEntityManager());
  }
}