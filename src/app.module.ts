import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ProductsModule } from './products/products.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { OrdersModule } from './orders/orders.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transactions/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.URL_MONGODB),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'test',
      entities: [UserEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    MailModule,
    ProductsModule,
    FileUploadModule,
    OrdersModule,
    MessageModule,
    NotificationModule,
    WalletModule,
    TransactionModule,
  ],
})
export class AppModule {}
