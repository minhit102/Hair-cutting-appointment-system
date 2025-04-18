import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Get,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/strategies/roles.guard';
import { GetProductParamsDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.productService.createProduct(createProductDto, files);
  }

  @Get()
  getProduct(@Query() getProductParamsDto: GetProductParamsDto) {
    return this.productService.getProduct(getProductParamsDto);
  }

  @Get(':id')
  async getProductDetail(@Param('id') id: string) {
    return this.productService.getProductDetail(id);
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.productService.updateProduct(id, updateProductDto, files);
  }
}
