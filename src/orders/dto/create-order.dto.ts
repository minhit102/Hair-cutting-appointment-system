import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsMongoId,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentStatus } from 'src/common/enum/payment-status.enum';
import { Delivery } from 'src/common/enum/delivery.enum';
import { ItemDto } from './item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsEnum(Delivery)
  delivery: Delivery;

  @IsNumber()
  discount: number;

  @IsNumber()
  tax: number;

  @IsNumber()
  shippingCost: number;
}
