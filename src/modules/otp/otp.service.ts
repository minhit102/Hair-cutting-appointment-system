import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { Otp, OtpDocument } from '../../schemas/otp.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MailService } from 'src/mail/mail.service';
import { SENT_OTP } from 'src/common/constants/queue.constant';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    @InjectQueue('otpQueue') private readonly otpQueue: Queue,
    private mailService: MailService,
  ) {}

  async generateAndSaveOTP(email: string): Promise<string> {
    const otp = randomInt(100000, 999999).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 2);
    const findUserOTP = await this.otpModel.findOne({ email });
    if (!findUserOTP) {
      await this.otpModel.create({ email, otp, expiresAt });
    } else {
      await this.otpModel.findByIdAndUpdate(findUserOTP._id, {
        email,
        otp,
        expiresAt,
      });
    }
    return otp;
  }

  async sendOtp(email: string, otp: string) {
    await this.otpQueue.add(SENT_OTP, { email, otp });
  }

  async sendOtpToUser(email: string, otp: string) {
    this.mailService.sendUserConfirmation(email, otp);
  }
}
