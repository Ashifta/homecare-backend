import { Injectable, Logger } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class WhatsappOtpProvider {
  private readonly logger = new Logger(WhatsappOtpProvider.name);
  private client: Twilio.Twilio;

  constructor() {
    this.client = new Twilio.Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendSms(to: string, message: string) {
    try {
      const res = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_FROM,
        to,
      });

      this.logger.log(`SMS sent: ${res.sid}`);
      return res.sid;
    } catch (error) {
      this.logger.error('SMS failed', error);
      throw error;
    }
  }

async sendWhatsApp(to: string, message: string) {
  try {
    const whatsappTo = to.startsWith('whatsapp:')
      ? to
      : `whatsapp:${to}`;

    const from = process.env.TWILIO_WHATSAPP_FROM;

    if (!from?.startsWith('whatsapp:')) {
      throw new Error('TWILIO_WHATSAPP_FROM must start with whatsapp:');
    }

    this.logger.log(`Sending WhatsApp to ${whatsappTo}`);

    const res = await this.client.messages.create({
      body: message,
      from,
      to: whatsappTo,
    });

    this.logger.log(`WhatsApp sent: ${res.sid}`);
    return res.sid;
  } catch (error) {
    this.logger.error('WhatsApp failed', error);
    throw error;
  }
}

}
