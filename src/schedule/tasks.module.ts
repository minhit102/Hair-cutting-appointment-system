import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from 'src/schemas/branchs.schema';
import {
  Appointment,
  AppointmentSchema,
} from 'src/schemas/appointments.schema';
import { Invoice, InvoiceSchema } from 'src/schemas/invoices.schema';
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
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: InvoiceChartDay.name, schema: InvoiceChartDaySchema },
      { name: InvoiceChartMonth.name, schema: InvoiceChartMonthSchema },
    ]),
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
