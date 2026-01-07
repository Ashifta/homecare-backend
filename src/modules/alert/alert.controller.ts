
import { Controller, Get, Post, Param } from '@nestjs/common';
import { AlertService } from './alert.service';

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  list() {
    return this.alertService.listAlerts();
  }

  @Post(':id/ack')
  ack(@Param('id') id: string) {
    return this.alertService.acknowledge(id);
  }
}
