
import { Controller, Post, Body, Param, Headers } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('request')
  async request(@Body() body: any) {
    return this.appointmentService.requestAppointment(body);
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string, @Headers('role') role: string) {
    return this.appointmentService.approveAppointment(id, role);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @Body('reason') reason: string) {
    return this.appointmentService.cancelAppointment(id, reason);
  }
}
