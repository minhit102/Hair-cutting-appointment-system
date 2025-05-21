import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice, InvoiceSchema } from '../schemas/invoices.schema';
import { Service, ServiceSchema } from 'src/schemas/services.schema';
import {
  HairStylist,
  HairStylistSchema,
} from 'src/schemas/hair-stylist.schemas';
import { Branch, BranchSchema } from 'src/schemas/branchs.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Invoice.name,
        schema: InvoiceSchema,
      },
      {
        name: Service.name,
        schema: ServiceSchema,
      },
      {
        name: HairStylist.name,
        schema: HairStylistSchema,
      },
      {
        name: Branch.name,
        schema: BranchSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
