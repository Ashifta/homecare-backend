import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TenantGuard } from './common/tenant/tenant.guard';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';
import { RolesGuard } from './common/rbac/roles.guard';

import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';

import { SlotModule } from './modules/slot/slot.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ActorModule } from './modules/actor/actor.module';
import { CentralAssignmentModule } from './modules/central-assignment/central-assignment.module';
import { LocationModule } from './modules/location/location.module';

import { OutcomeModule } from './modules/outcome/outcome.module';
import { AlertModule } from './modules/alert/alert.module';
import { SlaModule } from './modules/sla/sla.module';

import { WalletModule } from './modules/wallet/wallet.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { PaymentModule } from './modules/payment/payment.module';
import { SettlementModule } from './modules/settlement/settlement.module';
import { PayoutModule } from './modules/payout/payout.module';
import { ReportModule } from './modules/report/report.module';

import { InfrastructureModule } from './infrastructure/infrastructure.module';



@Module({
  imports: [
    // ✅ TypeORM runtime configuration (THIS FIXES YOUR ERROR)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, // 👈 critical
      synchronize: true,      // dev only
    }),

    InfrastructureModule,

    AuthModule,
    SlotModule,
    AppointmentModule,
    ActorModule,
    CentralAssignmentModule,
    LocationModule,
    OutcomeModule,
    AlertModule,
    SlaModule,
    WalletModule,
    LedgerModule,
    PaymentModule,
    SettlementModule,
    PayoutModule,
    ReportModule,

  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
