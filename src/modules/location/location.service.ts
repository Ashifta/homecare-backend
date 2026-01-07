
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  async updateLocation(actorId: string, lat: number, lng: number) {
    try {
      this.logger.log(`Updating location for ${actorId}`);
      return { updated: true };
    } catch (error) {
      this.logger.error('Location update failed', error);
      throw error;
    }
  }
}
