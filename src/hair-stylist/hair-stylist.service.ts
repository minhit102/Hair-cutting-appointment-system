import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  HairStylist,
  HairStylistDocument,
} from 'src/schemas/hair-stylist.schemas';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from 'src/schemas/branchs.schema';

@Injectable()
export class HairStylistService {
  constructor(
    @InjectModel(HairStylist.name)
    private hairStylistModel: Model<HairStylistDocument>,
    @InjectModel(Branch.name)
    private branchModel: Model<BranchDocument>,
  ) {}
  async findAll(user: any, branchId: string) {
    const checkBranch = await this.branchModel.findById(branchId);
    if (!checkBranch) {
      throw new NotFoundException('Branch not found');
    }
    const checkUser = await this.hairStylistModel.findById(user.id);
  }

  async findById(id: string) {
    const checkUser = await this.hairStylistModel.findById(id);
    if (!checkUser) {
      throw new NotFoundException('User not found');
    }
    return checkUser;
  }
}
