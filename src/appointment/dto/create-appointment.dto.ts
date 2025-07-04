import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  branchId: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  hairStylistId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsString()
  notes?: string;

  @IsString()
  username?: string;
}
