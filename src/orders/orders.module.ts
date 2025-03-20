import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/schemas/orders.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { ProductsModule } from 'src/products/products.module';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';
import { NotificationModule } from 'src/notification/notification.module';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
    AuthModule,
    ProductsModule,
    UsersModule,
    NotificationModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
