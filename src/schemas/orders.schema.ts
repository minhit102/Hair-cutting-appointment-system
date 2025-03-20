import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Delivery } from 'src/common/enum/delivery.enum';
import { PaymentStatus } from 'src/common/enum/payment-status.enum';
import { User } from 'src/schemas/user.schema';
import { Product } from 'src/schemas/product.schema';
import { Size } from 'src/common/enum/size.enum';
import { Color } from 'src/common/enum/color.enum';
import { CompleteStatus } from 'src/common/enum/complete.enum.status';
import { ProductCategory } from 'src/common/enum/categorys.enum';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  customerId: User;

  @Prop({
    type: String,
    required: true,
  })
  customerName: string;

  @Prop({
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        productName: {
          type: String,
          required: true,
        },

        category: {
          required: true,
          enum: ProductCategory,
          type: String,
          default: ProductCategory.Other,
        },
        images: {
          type: [String],
        },

        size: {
          required: true,
          enum: Size,
          type: String,
          default: Size.MEDIUM,
        },
        color: {
          required: true,
          enum: Color,
          type: String,
          default: Color.BLACK,
        },
        quantity: {
          required: true,
          type: Number,
          default: 1,
        },
        price: {
          required: true,
          type: Number,
          default: 0,
        },
        total: {
          required: true,
          type: Number,
        },
      },
    ],
    required: true,
  })
  items: {
    productId: Product;
    size: Size;
    color: Color;
    quantity: number;
    total: number;
  }[];

  @Prop({
    required: true,
    enum: PaymentStatus,
    type: String,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Prop({
    required: true,
    enum: Delivery,
    type: String,
    default: Delivery.CASH_ON_DELIVERY,
  })
  delivery: Delivery;

  @Prop({
    required: true,
    enum: CompleteStatus,
    type: String,
    default: CompleteStatus.PENDING,
  })
  completeStatus: CompleteStatus;

  @Prop({
    required: true,
    type: Number,
    default: 50,
  })
  discount: number;

  @Prop({
    required: true,
    type: Number,
    default: 50,
  })
  tax: number;

  @Prop({
    required: true,
    type: Number,
    default: 50,
  })
  shippingCost: number;

  @Prop({
    required: true,
    type: Number,
  })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
