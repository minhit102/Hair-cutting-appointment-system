import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from 'src/schemas/branchs.schema';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import {
  HairStylist,
  HairStylistSchema,
} from 'src/schemas/hair-stylist.schemas';
import { DashbroadController } from './dashbroad.controller';
import { DashbroadService } from './dashbroad.service';
import { Invoice, InvoiceSchema } from 'src/schemas/invoices.schema';
import { User } from 'src/common/decorator/user.decorator';
import { UserSchema } from 'src/schemas/user.schema';
import {
  Appointment,
  AppointmentSchema,
} from 'src/schemas/appointments.schema';
import {
  InvoiceChartDay,
  InvoiceChartDaySchema,
} from 'src/schemas/invoice-chart-day';
import {
  InvoiceChartMonth,
  InvoiceChartMonthSchema,
} from 'src/schemas/invoice-chart-month';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: HairStylist.name, schema: HairStylistSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: User.name, schema: UserSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: InvoiceChartDay.name, schema: InvoiceChartDaySchema },
      { name: InvoiceChartMonth.name, schema: InvoiceChartMonthSchema },
    ]),
  ],
  controllers: [DashbroadController],
  providers: [DashbroadService],
  exports: [DashbroadService],
})
export class DashbroadModule {}
