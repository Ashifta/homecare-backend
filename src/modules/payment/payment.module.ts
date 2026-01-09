// src/modules/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
  ],
  providers: [
    PaymentService,
    PaymentRepository, // 🔥 REQUIRED
  ],
  exports: [
    PaymentService,
  ],
})
export class PaymentModule {}
