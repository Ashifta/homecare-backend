
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CentralAssignmentService {
  private readonly logger = new Logger(CentralAssignmentService.name);

  async assignProvider(providerId: string) {
    try {
      this.logger.log(`Assigning provider ${providerId} to central operator`);
      return { assigned: true };
    } catch (error) {
      this.logger.error('Central assignment failed', error);
      throw error;
    }
  }
}
