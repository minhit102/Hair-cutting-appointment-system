import { IsOptional, IsString } from 'class-validator';
import { BaseSearchDto } from './../../common/dto/base-search.dto';
import { ProductCategory } from 'src/common/enum/categorys.enum';
import { Vendor } from 'src/common/enum/vendor.enum';
import { CollectionProduct } from 'src/common/enum/collection.enum';

export class GetProductParamsDto extends BaseSearchDto {
  @IsOptional()
  @IsString()
  category?: ProductCategory;

  @IsOptional()
  @IsString()
  vendor?: Vendor;

  @IsOptional()
  @IsString()
  collection?: CollectionProduct;
}
