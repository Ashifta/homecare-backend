
import { Injectable, Logger } from '@nestjs/common';
import { RedisLockService } from '../../infrastructure/redis/redis-lock.service';

@Injectable()
export class SlotService {
  private readonly logger = new Logger(SlotService.name);

  constructor(private readonly lockService: RedisLockService) {}

  async generateDailySlots(actorId: string, date: string) {
    try {
      this.logger.log(`Generating slots for ${actorId} on ${date}`);
      return { generated: true };
    } catch (error) {
      this.logger.error('Slot generation failed', error);
      throw error;
    }
  }

  async lockSlot(slotKey: string) {
    try {
      const locked = await this.lockService.lock(slotKey);
      if (!locked) throw new Error('Slot already locked');
      return { locked: true };
    } catch (error) {
      this.logger.error('Slot lock failed', error);
      throw error;
    }
  }

  async unlockSlot(slotKey: string) {
    try {
      await this.lockService.unlock(slotKey);
      return { unlocked: true };
    } catch (error) {
      this.logger.error('Slot unlock failed', error);
      throw error;
    }
  }
}
