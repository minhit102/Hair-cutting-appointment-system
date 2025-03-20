import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { AuthModule } from 'src/auth/auth.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    AuthModule,
    FileUploadModule,
    NestjsFormDataModule,
  ],
  controllers: [ProductController],
  providers: [ProductsService],
})
export class ProductsModule {}
