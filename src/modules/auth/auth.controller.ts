import {
  Body,
  Controller,
  Headers,
  Post,
  BadRequestException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SendOtpDto } from './../dto/send-otp.dto';
import { VerifyOtpDto } from './../dto/verify-otp.dto';
import { Public } from './../../common/decorators/public.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Send OTP via SMS / WhatsApp
   * Tenant is mandatory and enforced by TenantGuard
   */
@Public()
@Post('send-otp')
  async  sendOtp(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: SendOtpDto) {
   await this.authService.sendOtp(
      tenantId,
      dto.phoneNumber,
      dto.channel,
  );
    return {
    message: 'OTP sent successfully',
  };
}

  /**
   * Verify OTP and issue JWT
   * Single-device enforcement handled in AuthService
   */
  @Public()
  @Post('verify-otp')
  async verifyOtp(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: VerifyOtpDto,
  ) {
    if (!tenantId) {
      throw new BadRequestException('X-Tenant-Id header missing');
    }

    return this.authService.verifyOtp(
      tenantId,
      dto.phoneNumber,
      dto.otp,
      dto.channel,
    );
  }
}
