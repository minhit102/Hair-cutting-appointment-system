import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Invoice, InvoiceDocument } from 'src/schemas/invoices.schema';
import { Branch, BranchDocument } from 'src/schemas/branchs.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Appointment,
  AppointmentDocument,
} from 'src/schemas/appointments.schema';
import {
  HairStylist,
  HairStylistDocument,
} from 'src/schemas/hair-stylist.schemas';
import { Admin, AdminDocument } from 'src/schemas/admin.schema';
import {
  InvoiceChartDay,
  InvoiceChartDayDocument,
} from 'src/schemas/invoice-chart-day';
import {
  InvoiceChartMonth,
  InvoiceChartMonthDocument,
} from 'src/schemas/invoice-chart-month';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(InvoiceChartDay.name)
    private invoiceChartDayModel: Model<InvoiceChartDayDocument>,
    @InjectModel(InvoiceChartMonth.name)
    private invoiceChartMonthModel: Model<InvoiceChartMonthDocument>,
  ) {}

  @Cron('0 22 * * *') // Run daily at midnight
  async handleCronDay() {
    const branchs = await this.branchModel.find();
    for (const branch of branchs) {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 0));

      const totalRevenue = await this.invoiceModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            branchId: branch._id,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
          },
        },
      ]);

      await this.invoiceChartDayModel.create({
        branchId: branch._id,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalAppointment: 0,
        date: startOfDay,
      });
    }
  }

  @Cron('0 22 * * *') // Run daily at midnight
  async handleCronMonth() {
    const branchs = await this.branchModel.find();
    for (const branch of branchs) {
      const currentDate = new Date();

      // Thời điểm bắt đầu của tháng hiện tại
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
        0,
        0,
        0,
        0,
      );

      // Thời điểm kết thúc của tháng hiện tại
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      const totalRevenue = await this.invoiceModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            branchId: branch._id,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
          },
        },
      ]);

      await this.invoiceChartMonthModel.create({
        branchId: branch._id,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalAppointment: 0,
        date: startOfMonth,
      });
    }
  }
}
