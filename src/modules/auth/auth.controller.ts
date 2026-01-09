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
import { JwtAuthGuard } from './../../common/auth/jwt-auth.guard';
import { Get, Req , UseGuards } from '@nestjs/common';
import { Request } from 'express';


import { Roles } from '../../common/rbac/roles.decorator';
import { Role } from '../../common/rbac/roles.enum';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }

  //from tocken we will get 
  //"userId": "3493a0b6-f36a-4639-93ab-48edb72ee334",
  //"tenantId": "11111111-1111-1111-1111-111111111111",
  //fetch the role from DB based on userId and tenantId, if Doctor the pass
  //DB access is fast as we use indexing for userId and tenantId
  @UseGuards(JwtAuthGuard)
  @Roles(Role.RECEIVER)
  @Get('/me/pa')
  test(){
    return "Test";
  }

  /**
   * Send OTP via SMS / WhatsApp
   * Tenant is mandatory and enforced by TenantGuard
   */
@Post('send-otp')
@Public()
async sendOtp(@Body() dto: SendOtpDto) {
  return this.authService.sendOtp(dto.phoneNumber);
}

@Post('verify-otp')
@Public()
async verifyOtp(@Body() dto: VerifyOtpDto) {
  return this.authService.verifyOtp(
    dto.phoneNumber,
    dto.otp
  );
}
}
