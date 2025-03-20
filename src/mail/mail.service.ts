import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'minhhoangtrong1002@gmail.com',
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation',
      context: {
        otp: otp,
      },
    });
  }
}
