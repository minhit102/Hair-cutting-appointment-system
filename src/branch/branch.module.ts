import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { Branch, BranchSchema } from 'src/schemas/branchs.schema';
import { Admin } from 'src/common/decorator/admin.decorator';
import { AdminSchema } from 'src/schemas/admin.schema';
import {
  HairStylist,
  HairStylistSchema,
} from 'src/schemas/hair-stylist.schemas';
import { BranchAdminController } from './branch.controller.admin';
import { BranchAdminService } from './branch.service.admin';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: HairStylist.name, schema: HairStylistSchema },
    ]),
  ],
  controllers: [BranchController, BranchAdminController],
  providers: [BranchService, BranchAdminService],
  exports: [BranchService, BranchAdminService],
})
export class BranchModule {}
