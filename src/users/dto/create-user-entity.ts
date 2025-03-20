import { IsNumber, IsString } from 'class-validator';
export class CreateUserEntityDto {
  @IsNumber()
  id: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
