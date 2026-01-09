import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { redisClient } from './../../infrastructure/redis/redis.provider';
import { OtpService } from './../otp/otp.service';
import { Role } from '../../common/rbac/roles.enum';
import { getTenantId } from 'src/common/tenant/tenant.helper';

import { User } from '../users/user.entity';
import { UserRole } from '../users/user-role.entity';
import { UserRepository } from './../../modules/users/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,

    // ✅ tenant-aware repository
    private readonly userRepo: UserRepository,

    // UserRole can stay as plain Repository
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
  ) {}

async sendOtp(phoneNumber: string) {
  const tenantId = getTenantId();

  try {
    // 1️⃣ Try WhatsApp first
    await this.otpService.sendOtp(
      tenantId,
      phoneNumber,
      'WHATSAPP',
    );

    return {
      success: true,
      channel: 'WHATSAPP',
      message: 'OTP sent via WhatsApp',
    };
  } catch (err) {
    // 2️⃣ Fallback to SMS
    await this.otpService.sendOtp(
      tenantId,
      phoneNumber,
      'SMS',
    );

    return {
      success: true,
      channel: 'SMS',
      message: 'OTP sent via SMS',
    };
  }
}


  async verifyOtp(
  phoneNumber: string,
  otp: string,
) {
  const tenantId = getTenantId();

  // 1️⃣ Verify OTP (channel-agnostic)
  await this.otpService.verifyOtp(
    tenantId,
    phoneNumber,
    otp,
  );

  // 2️⃣ Session key (no channel tracking)
  const sessionKey = `session:${tenantId}:${phoneNumber}`;

  await redisClient.set(
    sessionKey,
    'ACTIVE',
    'EX',
    60 * 60 * 4,
  );

  // 3️⃣ Load user (tenant-safe)
  let user = await this.userRepo.findOne({
    where: { phoneNumber },
  });

  if (!user) {
    user = this.userRepo.createForTenant({ phoneNumber });
    await this.userRepo.save(user);

    await this.userRoleRepo.save(
      this.userRoleRepo.create({
        tenantId,
        userId: user.id,
        role: Role.RECEIVER,
        isActive: true,
      }),
    );
  }

  const userRole = await this.userRoleRepo.findOne({
    where: {
      tenantId,
      userId: user.id,
      isActive: true,
    },
  });

  if (!userRole) {
    throw new UnauthorizedException('User has no active role');
  }

  // 4️⃣ Issue JWT
  return {
    accessToken: this.jwtService.sign({
      sub: user.id,
      tenantId,
      phoneNumber,
      role: userRole.role,
    }),
  };
}
}
