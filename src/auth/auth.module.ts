import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { OtpService } from '../modules/otp/otp.service';
import { Otp, OtpSchema } from '../schemas/otp.schema';
import { BullModule } from '@nestjs/bull';
import { OtpProcessor } from 'src/common/otp.process';
import { MailModule } from 'src/mail/mail.module';
import { PasswordService } from '../common/password.service';
import { OTP_QUEUE } from 'src/common/constants/queue.constant';
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    BullModule.registerQueue({
      name: OTP_QUEUE,
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Otp.name,
        schema: OtpSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.EXPERIRES_IN },
      }),
    }),
    PassportModule,
    MailModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    OtpService,
    OtpProcessor,
    PasswordService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
