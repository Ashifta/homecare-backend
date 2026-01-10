import { Injectable, UnauthorizedException } from '@nestjs/common';
import { redisClient } from '../../infrastructure/redis/redis.provider';
import { ExotelOtpProvider } from './provider/exotel.provider';
import { WhatsappOtpProvider } from './provider/whatsapp.provider'

@Injectable()
export class OtpService {
  constructor(
    private readonly exotelProvider: ExotelOtpProvider,
    private readonly whatsappProvider: WhatsappOtpProvider,
  ) {}

  async sendOtp(
    phoneNumber: string,
    channel: 'SMS' | 'WHATSAPP',
  ): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp)

    await redisClient.set(
      `otp:${'login'}:${phoneNumber}`,
      otp,
      'EX',
      300,
    );

    if (channel === 'SMS') {
      await this.exotelProvider.sendOtp(phoneNumber, otp);
    } else {
      await this.whatsappProvider.sendWhatsApp(phoneNumber, otp);
    }
  }

  async verifyOtp(
    tenantId: string,
    phoneNumber: string,
    otp: string,
  ): Promise<void> {
    const key = `otp:${tenantId}:${phoneNumber}`;
    const storedOtp = await redisClient.get(key);

    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    await redisClient.del(key);
  }
}
