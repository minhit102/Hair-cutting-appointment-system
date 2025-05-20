import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAppointmentAdminDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit: number = 10;

  @IsOptional()
  @IsString()
  status: string = 'all';

  @IsOptional()
  @IsString()
  search: string = '';
}
