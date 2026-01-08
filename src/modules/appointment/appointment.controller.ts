import { Controller, Post, Body, Param, Headers } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

import { Roles } from '../../common/rbac/roles.decorator';
import { Role } from '../../common/rbac/roles.enum';
import { SelectFundSourceDto } from './dto/select-fundsource.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  // 1️⃣ Request appointment
  @Post('request')
  async request(@Body() body: any) {
    return this.appointmentService.requestAppointment(body);
  }

  // 2️⃣ Approve appointment
  @Post(':id/approve')
  @Roles(Role.CENTRAL)
  async approve(@Param('id') id: string) {
    return this.appointmentService.approveAppointment(id);
  }

  // 3️⃣ Cancel appointment
  @Post(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.appointmentService.cancelAppointment(id, reason);
  }

  // 4️⃣ ✅ Select FundSource (CENTRAL / FINANCE only)
  @Post(':id/select-fundsource')
  @Roles(Role.CENTRAL, Role.FINANCE)
  async selectFundSource(
    @Param('id') id: string,
    @Body() dto: SelectFundSourceDto,
  ) {
    return this.appointmentService.selectFundSource(
      id,
      dto.fundSourceId,
    );
  }
}
