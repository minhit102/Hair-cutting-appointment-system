import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsNotEmpty()
  @IsString()
  stylistId: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @IsOptional()
  @IsString()
  username?: string;
}
