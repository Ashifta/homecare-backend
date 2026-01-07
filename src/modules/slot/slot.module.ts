
import { Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  controllers: [SlotController],
  providers: [SlotService],
  exports: [SlotService],
})
export class SlotModule {}
