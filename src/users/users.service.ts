import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { BadRequestException } from '@nestjs/common';
import { GetUserParamsDto } from 'src/common/dto/pagination.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { HttpStatus } from 'src/common/constants/http-status.enum';
import { HttpMessage } from 'src/common/constants/http-message.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { GetCustomerParamsDto } from './dto/get-customer.dto';
import { Role } from 'src/common/enum/role.enum';
import { FileUploadService } from 'src/common/service/file-upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // @InjectRepository(UserEntity)
    // private usersRepository: Repository<UserEntity>,
    private authService: AuthService,
    private fileUploadService: FileUploadService,
  ) {}

  async getProfileUser(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, user);
  }

  async getListUser(params: GetUserParamsDto): Promise<ResponseDto<any>> {
    const limit = parseInt(params.limit) || 1;
    const page = parseInt(params.page) || 10;
    const sortBy = params.sortBy || 'createdAt';
    const order = params.order === 'asc' ? 1 : -1;
    const skip = limit * (page - 1);

    const [total, users] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel
        .find()
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)
        .select('_id username email address role updateAt'),
    ]);

    const totalPage = Math.floor(total / limit) + 1;

    const data = {
      total: total,
      limit: limit,
      page: page,
      sortBy: sortBy,
      order: order,
      totalPage: totalPage,
      users: users,
    };
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, data);
  }

  async findUserByKeys(keys: string) {
    const regex = new RegExp(keys, 'i');
    const users = await this.userModel.find({
      $or: [
        { username: { $regex: regex } },
        { address: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    });
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, users);
  }

  async findOne(id: string): Promise<ResponseDto<any>> {
    const findUser = await this.userModel.findById(id);
    if (!findUser) {
      throw new BadRequestException('User already exists');
    }
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, findUser);
  }

  async findByEmail(email: string): Promise<ResponseDto<any>> {
    const findUser = await this.userModel.findOne({ email: email });
    if (!findUser) {
      throw new BadRequestException('User already exists');
    }
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, findUser);
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<any>> {
    const userUpdate = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      { new: true },
    );
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, userUpdate);
  }
  // async addUser(createUserDto: CreateUserDto) {
  //   this.authService.register(createUserDto);
  // }

  async getListCustomer(
    getCustomerParamsDto: GetCustomerParamsDto,
  ): Promise<ResponseDto<any>> {
    const {
      page = 1,
      limit = 10,
      sortBy,
      order,
      keyWord,
    } = getCustomerParamsDto;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    // const sortField = sortBy || 'totalAmount';
    const sortField = sortBy || 'firstName';
    const sortOrder = order === 'asc' ? 1 : -1;
    const pipeline: any[] = [
      {
        $match: {
          role: Role.Customer,
        },
      },
      ...(keyWord
        ? [
            {
              $match: {
                $or: [
                  { firstName: { $regex: keyWord, $options: 'i' } },
                  { lastName: { $regex: keyWord, $options: 'i' } },
                ],
              },
            },
          ]
        : []),
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'customerId',
          as: 'orders',
        },
      },
      {
        $unwind: {
          path: '$orders', // Mở rộng mảng orders thành các tài liệu đơn lẻ
          preserveNullAndEmptyArrays: true, // Giữ lại những khách hàng không có đơn hàng
        },
      },
      {
        $sort: { 'orders.createdAt': -1 },
      },
      {
        $group: {
          _id: '$_id',
          email: { $first: '$email' },
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          totalOrders: { $sum: 1 },
          totalAmount: {
            $sum: '$orders.total',
          },
          lastOrderDate: { $first: '$orders.createdAt' },
        },
      },
      {
        $addFields: {
          totalOrders: { $ifNull: ['$totalOrders', 0] },
          totalAmount: { $ifNull: ['$totalAmount', 0] },
          lastOrderDate: { $ifNull: ['$lastOrderDate', null] },
        },
      },
      {
        $sort: { [sortField]: sortOrder },
      },
      {
        $skip: (pageNumber - 1) * limitNumber,
      },
      {
        $limit: limitNumber,
      },
    ];
    const customerSummary = await this.userModel.aggregate(pipeline);
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, customerSummary);
  }
  // async creatUser(createUserEntityDto: CreateUserEntityDto) {
  //   console.log(createUserEntityDto);
  //   const user = await this.usersRepository.create(createUserEntityDto);
  //   return new ResponseDto(HttpStatus.OK, HttpMessage.OK, user);
  // }

  async updateAvt({ userId, file }: any) {
    const user = await this.userModel.findById(userId);
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type, only JPEG and PNG are allowed.',
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 10MB.');
    }
    const avtUrl = await this.fileUploadService.uploadImages(file);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const updateUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        imgAvt: avtUrl,
      },
      { new: true },
    );
  }
}
