import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { redisClient } from './../../infrastructure/redis/redis.provider';
import { OtpService } from './../otp/otp.service';
import { AppDataSource } from '../../infrastructure/database/datasource';
import { UserRole } from '../users/user-role.entity';
import { User } from '../users/user.entity';
import { Role } from '../../common/rbac/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
        @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
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
  await this.otpService.verifyOtp(tenantId, phoneNumber, otp);

  let user = await this.userRepo.findOne({
    where: { tenantId, phoneNumber },
  });

  if (!user) {
    user = this.userRepo.create({ tenantId, phoneNumber });
    await this.userRepo.save(user);

    await this.userRoleRepo.save(
      this.userRoleRepo.create({
        tenantId,
        userId: user.id,
        role: Role.PATIENT,
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

  const sessionKey = `session:${tenantId}:${phoneNumber}`;
  const existingChannel = await redisClient.get(sessionKey);

  if (existingChannel && existingChannel !== channel) {
    throw new UnauthorizedException('User already logged in on another device');
  }

  await redisClient.set(sessionKey, channel, 'EX', 60 * 60 * 4);

  return {
    accessToken: this.jwtService.sign({
      sub: user.id,
      tenantId,
      phoneNumber,
      role: userRole.role,
      channel,
    }),
  };
}



}
