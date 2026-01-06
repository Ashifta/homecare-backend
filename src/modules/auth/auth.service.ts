import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { redisClient } from './../../infrastructure/redis/redis.provider';
import { OtpService } from './../otp/otp.service';
import { AppDataSource } from '../../infrastructure/database/datasource';
import { UserRole } from '../users/user-role.entity';
import { User } from '../users/user.entity';
import { Role } from '../../common/rbac/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}


  async sendOtp(
    tenantId: string,
    phoneNumber: string,
    channel: 'SMS' | 'WHATSAPP',
  ) {
    await this.otpService.sendOtp(tenantId, phoneNumber, channel);
  }

async verifyOtp(
  tenantId: string,
  phoneNumber: string,
  otp: string,
  channel: string,
) {
  console.log( "----11--------------------" )
  // 1️⃣ Verify OTP
  await this.otpService.verifyOtp(tenantId, phoneNumber, otp);
 console.log( tenantId )
  console.log( phoneNumber )
    console.log( otp )
  console.log( "------------------------" )
  const userRepo = AppDataSource.getRepository(User);
  const userRoleRepo = AppDataSource.getRepository(UserRole);

  // 2️⃣ Find user
  let user = await userRepo.findOne({
    where: { tenantId, phoneNumber },
  });

  // 3️⃣ First login → create user + default PATIENT role
  if (!user) {
    user = userRepo.create({
      tenantId,
      phoneNumber,
    });
    await userRepo.save(user);

    await userRoleRepo.save(
      userRoleRepo.create({
        tenantId,
        userId: user.id,
        role: Role.PATIENT,
        isActive: true,
      }),
    );
  }

  // 4️⃣ Load ACTIVE role (SINGLE)
  const userRole = await userRoleRepo.findOne({
    where: {
      tenantId,
      userId: user.id,
      isActive: true,
    },
  });

  if (!userRole) {
    throw new UnauthorizedException('User has no active role');
  }

  const role = userRole.role as Role;

  // 5️⃣ Enforce single-device login
  const sessionKey = `session:${tenantId}:${phoneNumber}`;
  const existingchannel = await redisClient.get(sessionKey);

  if (existingchannel && existingchannel !== channel) {
    throw new UnauthorizedException(
      'User already logged in on another device',
    );
  }

  await redisClient.set(
    sessionKey,
    channel,
    'EX',
    60 * 60 * 4, // 4 hours
  );

  // 6️⃣ Issue JWT (SINGLE ROLE)
  return {
    accessToken: this.jwtService.sign({
      sub: user.id,
      tenantId,
      phoneNumber,
      role,        // ✅ SINGLE ROLE
      channel,
    }),
  };
}



}
