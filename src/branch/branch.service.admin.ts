import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch, BranchDocument } from 'src/schemas/branchs.schema';
import { UserDocument } from 'src/schemas/user.schema';
import { AdminDocument } from 'src/schemas/admin.schema';
import { Admin } from 'src/common/decorator/admin.decorator';

@Injectable()
export class BranchAdminService {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const newBranch = await this.branchModel.create(createBranchDto);
    return newBranch;
  }

  async findAll(): Promise<Branch[]> {
    return this.branchModel.find().exec();
  }

  async findOne(id: string): Promise<Branch> {
    return this.branchModel.findById(id).exec();
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    return this.branchModel
      .findByIdAndUpdate(id, updateBranchDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Branch> {
    return this.branchModel.findByIdAndDelete(id).exec();
  }

  async getDashboardBranch(user: any) {
    const userInfo = await this.adminModel.findOne({ _id: user.id });
    const branch = await this.branchModel.findOne({ _id: userInfo.branchId });

    return branch;
  }
}
