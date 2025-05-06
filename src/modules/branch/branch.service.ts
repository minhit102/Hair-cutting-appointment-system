import { Injectable, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from '../../schemas/branchs.schema';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/strategies/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/roles.decorator';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
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
}
