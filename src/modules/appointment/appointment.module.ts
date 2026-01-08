
import { Module, forwardRef } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { SlotModule } from '../slot/slot.module';
import { SettlementModule } from '../settlement/settlement.module';

@Module({
  imports: [SlotModule,
            forwardRef(() => SettlementModule),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService], // ✅ REQUIRED
})
export class AppointmentModule {}
