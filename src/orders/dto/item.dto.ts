import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Size } from 'src/common/enum/size.enum';
import { Color } from 'src/common/enum/color.enum';

export class ItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsOptional()
  @IsEnum(Size)
  size: Size;

  @IsOptional()
  @IsEnum(Color)
  color: Color;

  @IsOptional()
  @IsNumber()
  quantity: number;
}
