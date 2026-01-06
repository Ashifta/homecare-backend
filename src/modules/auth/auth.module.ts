import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { OtpService } from './../otp/otp.service';
import { ExotelOtpProvider } from './../otp/provider/exotel.provider';
import { WhatsappOtpProvider } from './../otp/provider/whatsapp.provider';

import { JwtStrategy } from './strategies/jwt.strategy';

import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '4h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpService,
    ExotelOtpProvider,
    WhatsappOtpProvider,
    JwtStrategy,
  ],
  exports: [
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}
