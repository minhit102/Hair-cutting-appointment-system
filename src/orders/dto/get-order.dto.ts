import { IsOptional, IsString } from 'class-validator';
import { BaseSearchDto } from './../../common/dto/base-search.dto';
import { CompleteStatus } from 'src/common/enum/complete.enum.status';
import { PaymentStatus } from 'src/common/enum/payment-status.enum';
import { Delivery } from 'src/common/enum/delivery.enum';

export class GetOrderParamsDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  completeStatus: CompleteStatus;

  @IsOptional()
  @IsString()
  paymentStatus: PaymentStatus;

  @IsOptional()
  @IsString()
  delivery: Delivery;
}
