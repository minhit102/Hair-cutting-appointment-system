import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  HairStylist,
  HairStylistDocument,
} from 'src/schemas/hair-stylist.schemas';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from 'src/schemas/branchs.schema';
import { Admin } from 'src/common/decorator/admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
import { CreateHairStylistDto } from './dto/create-hair-stylist.dto';
import { PasswordService } from 'src/common/password.service';
import { GetHairStyleListDto } from './dto/getHairStyleList.dto';
import { Invoice, InvoiceDocument } from 'src/schemas/invoices.schema';
import { Review, ReviewDocument } from 'src/schemas/reviews.schemas';
import { UpdateHairStylistDto } from './dto/update-hair-stylist.dto';

@Injectable()
export class HairStylistAdminService {
  constructor(
    @InjectModel(HairStylist.name)
    private hairStylistModel: Model<HairStylistDocument>,
    @InjectModel(Branch.name)
    private branchModel: Model<BranchDocument>,
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
    private readonly passwordService: PasswordService,
    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
  ) {}
  async findAllByBranchId({ id, user }) {
    const checkBranch = await this.branchModel.findById(id);
    const admin = await this.adminModel.findById(user.id);
    if (!checkBranch) {
      throw new NotFoundException('Branch not found');
    }

    if (admin.branchId.toString() !== checkBranch._id.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to access this branch',
      );
    }
    const hairStylist = await this.hairStylistModel.find({
      branchId: id,
    });
    return hairStylist;
  }

  async create(createHairStylistDto: CreateHairStylistDto, user: any) {
    const adminBranch = await this.adminModel.findById(user.id);
    if (!adminBranch) {
      throw new NotFoundException('Admin not found');
    }
    const checkBranch = await this.branchModel.findById(adminBranch.branchId);
    const checkEmail = await this.hairStylistModel.findOne({
      email: createHairStylistDto.email,
    });

    if (checkEmail) {
      throw new BadRequestException('Email already exists');
    }
    if (!checkBranch) {
      throw new NotFoundException('Branch not found');
    }

    if (adminBranch.branchId.toString() !== checkBranch._id.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to access this branch',
      );
    }
    const hashPassword = await this.passwordService.hashPassword(
      createHairStylistDto.password,
    );
    const hairStylist = await this.hairStylistModel.create({
      ...createHairStylistDto,
      branchId: adminBranch.branchId,
      password: hashPassword,
    });
    return hairStylist;
  }

  async findAllByAdminId({
    id,
    query,
  }: {
    id: string;
    query: GetHairStyleListDto;
  }) {
    const admin = await this.adminModel.findById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    const { page, limit, status, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.hairStylistModel.find();
    queryBuilder.where('branchId', admin.branchId);
    queryBuilder.where('isDeleted', { $ne: true });

    if (status !== 'all') {
      queryBuilder.where('status', status);
    }

    console.log('==========================', status);

    if (search) {
      queryBuilder.or([{ username: { $regex: search, $options: 'i' } }]);
    }
    queryBuilder.sort({ createdAt: -1 });

    const [total, hairStylist] = await Promise.all([
      this.hairStylistModel.countDocuments(queryBuilder.getQuery()),
      queryBuilder
        .populate({
          path: 'branchId',
          select: 'name',
        })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hairStylistConvert = await Promise.all(
      hairStylist.map(async (item) => {
        const invoiceCount = await this.invoiceModel.countDocuments({
          hairStylistId: item._id,
        });

        return {
          id: item._id,
          username: item.username,
          email: item.email,
          status: item.status,
          salaryBase: item.salaryBase,
          imgAvt: item.imgAvt,
          phone: item.phone,
          invoiceCount,
        };
      }),
    );

    return {
      hairStylists: hairStylistConvert,
      total,
      totalPages,
      page,
      limit,
    };
  }

  async getStylistDetailById({ id }: { id: string }): Promise<any> {
    const hairStylist = await this.hairStylistModel.findById(id);
    if (!hairStylist) {
      throw new NotFoundException('Hair stylist not found');
    }

    const invoiceCount = await this.invoiceModel.countDocuments({
      hairStylistId: hairStylist._id,
    });

    const review = await this.reviewModel.find({
      hairStylistId: hairStylist._id,
    });

    const reviewCount = await this.reviewModel.countDocuments({
      hairStylistId: hairStylist._id,
    });

    const reviewRatingTotal = review.reduce(
      (acc, item) => acc + item.rating,
      0,
    );
    const reviewRatingAverage =
      reviewCount > 0 ? reviewRatingTotal / reviewCount : 0;

    const now = new Date();
    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const lastDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    const totalInvoiceMonthBefore = await this.invoiceModel.countDocuments({
      hairStylistId: hairStylist._id,
      createdAt: {
        $gte: firstDayOfLastMonth,
        $lte: lastDayOfLastMonth,
      },
    });

    const salaryMonthBefore =
      hairStylist.salaryBase + totalInvoiceMonthBefore * 0.3;

    return {
      id: hairStylist._id,
      name: hairStylist.username,
      email: hairStylist.email,
      phone: hairStylist.phone,
      avatar: hairStylist.imgAvt,
      status: hairStylist.status,
      baseSalary: hairStylist.salaryBase,
      rating: reviewRatingAverage,
      totalInvoiceMonthBefore,
      salaryMonthBefore,
      invoiceCount,
      service: 5,
      joinDate: (hairStylist as any).createdAt,
      review: {
        reviewCount,
        reviewRatingAverage,
        reviewList: review,
      },
    };
  }

  async updateStylist({
    id,
    body,
  }: {
    id: string;
    body: UpdateHairStylistDto;
  }) {
    const hairStylist = await this.hairStylistModel.findById(id);
    if (!hairStylist) {
      throw new NotFoundException('Hair stylist not found');
    }
    return this.hairStylistModel.findByIdAndUpdate(id, body, { new: true });
  }

  deleteStylist({ id }: { id: string }) {
    return this.hairStylistModel.findByIdAndUpdate(id, { isDeleted: true });
  }
}
