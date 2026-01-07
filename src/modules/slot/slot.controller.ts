
import { Controller, Post, Param } from '@nestjs/common';
import { SlotService } from './slot.service';

@Controller('slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post(':actorId/:date')
  async generate(@Param('actorId') actorId: string, @Param('date') date: string) {
    return this.slotService.generateDailySlots(actorId, date);
  }
}
