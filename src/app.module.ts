import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BranchModule } from './branch/branch.module';
import { ServiceModule } from './service/service.module';
import { HairStylistModule } from './hair-stylist/hair-stylist.module';
import { AppointmentModule } from './appointment/appointment.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ReviewModule } from './review/review.module';
import { DashbroadModule } from './dashbroad/dashbroad.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.URL_MONGODB),
    UsersModule,
    AuthModule,
    MailModule,
    FileUploadModule,
    MessageModule,
    NotificationModule,
    BranchModule,
    ServiceModule,
    HairStylistModule,
    AppointmentModule,
    InvoicesModule,
    ReviewModule,
    DashbroadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
