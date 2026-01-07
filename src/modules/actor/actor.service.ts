
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ActorService {
  private readonly logger = new Logger(ActorService.name);

  async createActor(payload: any) {
    try {
      this.logger.log('Creating actor');
      return { status: 'CREATED', payload };
    } catch (error) {
      this.logger.error('Failed to create actor', error);
      throw error;
    }
  }
}
