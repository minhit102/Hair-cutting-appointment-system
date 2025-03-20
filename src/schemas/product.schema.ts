// src/product/schemas/product.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProductCategory } from 'src/common/enum/categorys.enum';
import { CollectionProduct } from 'src/common/enum/collection.enum';
import { ProductTags } from 'src/common/enum/tags.enum';
import { Vendor } from 'src/common/enum/vendor.enum';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;

  @Prop({
    type: Number,
    required: true,
  })
  salePrice: number;

  @Prop({
    type: [String],
    required: false,
  })
  images: string[];

  @Prop({
    type: String,
    required: true,
    enum: Vendor,
    default: Vendor.Other,
  })
  vendor: Vendor;

  @Prop({
    required: true,
    type: String,
    enum: ProductCategory,
    default: ProductCategory.Other,
  })
  category: ProductCategory;

  @Prop({
    required: true,
    type: String,
    enum: CollectionProduct,
    default: CollectionProduct.Other,
  })
  collection: CollectionProduct;

  @Prop({
    required: true,
    type: [String],
    enum: ProductTags,
    default: [ProductTags.Other],
  })
  tags: ProductTags[];

  @Prop({
    type: String,
    required: false,
  })
  description: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  active: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
