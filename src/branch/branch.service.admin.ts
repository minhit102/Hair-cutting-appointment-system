import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch, BranchDocument } from 'src/schemas/branchs.schema';

@Injectable()
export class BranchAdminService {
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
