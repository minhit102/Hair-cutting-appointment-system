import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from 'src/schemas/branchs.schema';
import {
  HairStylist,
  HairStylistSchema,
} from 'src/schemas/hair-stylist.schemas';
import { HairStylistController } from './hair-stylist.controller';
import { HairStylistService } from './hair-stylist.service';
import { HairStylistAdminController } from './hair-stylist.controller.admin';
import { HairStylistAdminService } from './hair-stylist.service.admin';
import { Admin } from 'src/common/decorator/admin.decorator';
import { AdminSchema } from 'src/schemas/admin.schema';
import { PasswordService } from 'src/common/password.service';
import { Invoice, InvoiceSchema } from 'src/schemas/invoices.schema';
import { Review, ReviewSchema } from 'src/schemas/reviews.schemas';
import { Service, ServiceSchema } from 'src/schemas/services.schema';
import { Hairstyle, HairstyleSchema } from 'src/schemas/hair-style.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HairStylist.name, schema: HairStylistSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Hairstyle.name, schema: HairstyleSchema },
    ]),
  ],
  controllers: [HairStylistController, HairStylistAdminController],
  providers: [HairStylistService, HairStylistAdminService, PasswordService],
  exports: [HairStylistService, HairStylistAdminService],
})
export class HairStylistModule {}
