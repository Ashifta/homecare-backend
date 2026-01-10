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


  try {
    // 1️⃣ Try WhatsApp first
    await this.otpService.sendOtp(
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
  console.log('[verifyOtp] START', { phoneNumber });

  const tenantId = getTenantId();
  console.log('[verifyOtp] tenantId resolved', { tenantId });

  // 1️⃣ Verify OTP (channel-agnostic)
  console.log('[verifyOtp] verifying OTP');
  await this.otpService.verifyOtp(
    tenantId,
    phoneNumber,
    otp,
  );
  console.log('[verifyOtp] OTP verified');

  // 2️⃣ Session key (no channel tracking)
  const sessionKey = `session:${tenantId}:${phoneNumber}`;
  console.log('[verifyOtp] setting session key', { sessionKey });

  await redisClient.set(
    sessionKey,
    'ACTIVE',
    'EX',
    60 * 60 * 4,
  );

  // 3️⃣ Load user (tenant-safe)
  console.log('[verifyOtp] loading user');
  let user = await this.userRepo.findOne({
    where: { phoneNumber },
  });

  if (!user) {
    console.log('[verifyOtp] user not found, creating new user');

    user = this.userRepo.createForTenant({ phoneNumber });
    await this.userRepo.save(user);

    console.log('[verifyOtp] assigning RECEIVER role', {
      userId: user.id,
      tenantId,
    });

    await this.userRoleRepo.save(
      this.userRoleRepo.create({
        tenantId,
        userId: user.id,
        role: Role.RECEIVER,
        isActive: true,
      }),
    );
  } else {
    console.log('[verifyOtp] existing user found', { userId: user.id });
  }

  const userRole = await this.userRoleRepo.findOne({
    where: {
      tenantId,
      userId: user.id,
      isActive: true,
    },
  });

  if (!userRole) {
    console.error('[verifyOtp] NO ACTIVE ROLE', {
      userId: user.id,
      tenantId,
    });
    throw new UnauthorizedException('User has no active role');
  }

  console.log('[verifyOtp] role resolved', {
    role: userRole.role,
  });

  // 4️⃣ Issue JWT
  const payload = {
    sub: user.id,
    tenantId,
    phoneNumber,
    role: userRole.role,
  };

  console.log('[verifyOtp] issuing JWT', payload);

  return {
    accessToken: this.jwtService.sign(payload),
  };
}

}
