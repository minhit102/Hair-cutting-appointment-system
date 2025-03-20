import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseDto } from 'src/common/dto/response.dto';
import { HttpMessage } from 'src/common/constants/http-message.enum';
import { GetProductParamsDto } from './dto/get-product.dto';
import { FileUploadService } from './../file-upload/file-upload.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private fileUploadService: FileUploadService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    files: Array<Express.Multer.File>,
  ): Promise<ResponseDto<any>> {
    files.forEach((file) => {
      if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        throw new BadRequestException(
          'Invalid file type, only JPEG and PNG are allowed.',
        );
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds 10MB.');
      }
    });
    const uploadedUrls = await this.fileUploadService.uploadImages(files);
    const product = {
      ...createProductDto,
      images: uploadedUrls,
    };
    const newProduct = await this.productModel.create(product);
    return new ResponseDto(HttpStatus.CREATED, HttpMessage.CREATED, newProduct);
  }

  async getProduct(
    getProductParamsDto: GetProductParamsDto,
  ): Promise<ResponseDto<any>> {
    const {
      page,
      limit,
      sortBy,
      order,
      category,
      vendor,
      collection,
      keyWord,
    } = getProductParamsDto;

    const sortField = sortBy || 'title';
    const sortOrder = order === 'asc' ? 1 : -1;
    const filter: any = {};

    if (category) filter.category = category;
    if (vendor) filter.vendor = vendor;
    if (collection) filter.collection = collection;
    if (keyWord) filter.title = { $regex: keyWord, $options: 'i' };
    console.log(filter);
    const [total, listProduct] = await Promise.all([
      this.productModel.countDocuments(filter).exec(),
      this.productModel
        .find(filter)
        .sort({ [sortField]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit);
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, {
      data: listProduct,
      limit,
      page,
      total,
      collection,
      totalPages,
    });
  }

  async getProductDetail(id: string): Promise<ResponseDto<any>> {
    const findProduct = await this.productModel.findById(id);
    console.log(id);
    if (!findProduct) {
      throw new BadRequestException('ProductId not exits');
    }
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, findProduct);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    files: Array<Express.Multer.File>,
  ): Promise<ResponseDto<any>> {
    const findProduct = await this.productModel.findById(id);
    console.log(findProduct);
    if (!findProduct) {
      throw new BadRequestException('ProductId not exits');
    }
    files.forEach((file) => {
      if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        throw new BadRequestException(
          'Invalid file type, only JPEG and PNG are allowed.',
        );
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds 10MB.');
      }
    });
    const uploadedUrls = await this.fileUploadService.uploadImages(files);
    let imagesNew;
    if (updateProductDto.oldImages) {
      imagesNew = updateProductDto.oldImages.concat(uploadedUrls);
    } else {
      imagesNew = uploadedUrls;
    }
    const product = {
      ...updateProductDto,
      images: imagesNew,
    };
    const productUpdate = await this.productModel.findByIdAndUpdate(
      id,
      product,
      {
        new: true,
      },
    );
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, productUpdate);
  }
}
