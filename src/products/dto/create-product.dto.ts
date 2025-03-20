import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ProductCategory } from 'src/common/enum/categorys.enum';
import { CollectionProduct } from 'src/common/enum/collection.enum';
import { ProductTags } from 'src/common/enum/tags.enum';
import { Vendor } from 'src/common/enum/vendor.enum';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  salePrice: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsEnum(Vendor)
  vendor: Vendor;

  @IsOptional()
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsOptional()
  @IsEnum(CollectionProduct)
  collection: CollectionProduct;

  @IsOptional()
  @IsArray()
  @IsEnum(ProductTags, { each: true })
  tags: ProductTags[];

  @IsOptional()
  @IsString()
  description: string;
}
