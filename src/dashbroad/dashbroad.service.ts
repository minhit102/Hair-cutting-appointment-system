import { Injectable, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Admin } from 'src/common/decorator/admin.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
import {
  Appointment,
  AppointmentDocument,
} from 'src/schemas/appointments.schema';
import { Branch, BranchDocument } from 'src/schemas/branchs.schema';
import {
  HairStylist,
  HairStylistDocument,
} from 'src/schemas/hair-stylist.schemas';
import {
  InvoiceChartDay,
  InvoiceChartDayDocument,
} from 'src/schemas/invoice-chart-day';
import {
  InvoiceChartMonth,
  InvoiceChartMonthDocument,
} from 'src/schemas/invoice-chart-month';
import { Invoice, InvoiceDocument } from 'src/schemas/invoices.schema';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class DashbroadService {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(HairStylist.name)
    private hairStylistModel: Model<HairStylistDocument>,
    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(InvoiceChartDay.name)
    private invoiceChartDayModel: Model<InvoiceChartDayDocument>,
    @InjectModel(InvoiceChartMonth.name)
    private invoiceChartMonthModel: Model<InvoiceChartMonthDocument>,
  ) {}

  async getRevenueChartDay(user: any) {
    const findAdmin = await this.adminModel.findById(user.id);
    const branchId = new mongoose.Types.ObjectId(findAdmin.branchId);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    const result = await this.invoiceChartDayModel.find({
      branchId: branchId,
      createdAt: { $gte: startDate, $lte: endDate },
    });
    return result;
  }

  async getRevenueChartMonth(user: any) {
    const findAdmin = await this.adminModel.findById(user.id);
    const branchId = new mongoose.Types.ObjectId(findAdmin.branchId);
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    console.log(startDate, 'startDate');

    const endDate = new Date();
    const result = await this.invoiceChartMonthModel.find({
      branchId: branchId,
      createdAt: { $gte: startDate, $lte: endDate },
    });
    return result;
  }

  async getChangeRevenue(user: any) {
    const findAdmin = await this.adminModel.findById(user.id);
    const branchId = findAdmin.branchId.toString();
    const [
      todayRevenue,
      yesterdayRevenue,
      revenue7days,
      revenue7daysBefore,
      revenue30days,
      revenue30daysBefore,
      todayAppointment,
      yesterdayAppointment,
      appointment7days,
      appointment7daysBefore,
      appointment30days,
      appointment30daysBefore,
      totalInvoiceToday,
      totalInvoiceYesterday,
      totalInvoice7days,
      totalInvoice7daysBefore,
      totalInvoice30days,
      totalInvoice30daysBefore,
    ] = await Promise.all([
      this.getTotalRevenueToday(branchId),
      this.getTotalRevenueYesterday(branchId),
      this.getTotalRevenue7days(branchId),
      this.getTotalRevenue7dayBefore(branchId),
      this.getTotalRevenue30days(branchId),
      this.getTotalRevenue30dayBefore(branchId),
      this.getTotalAppointmentToday(branchId),
      this.getTotalAppointmentYesterday(branchId),
      this.getTotalAppointment7days(branchId),
      this.getTotalAppointment7daysBefore(branchId),
      this.getTotalAppointment30days(branchId),
      this.getTotalAppointment30daysBefore(branchId),
      this.getTotalInvoiceToday(branchId),
      this.getTotalInvoiceYesterday(branchId),
      this.getTotalInvoice7days(branchId),
      this.getTotalInvoice7daysBefore(branchId),
      this.getTotalInvoice30days(branchId),
      this.getTotalInvoice30daysBefore(branchId),
    ]);

    return {
      revenue: {
        totalRevenueToday: todayRevenue,
        totalRevenueYesterday: yesterdayRevenue,
        totalRevenueTodayChange: yesterdayRevenue
          ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
          : 0,
        totalRevenue7days: revenue7days,
        totalRevenue7dayChange: revenue7daysBefore
          ? ((revenue7days - revenue7daysBefore) / revenue7daysBefore) * 100
          : 0,
        totalRevenue30days: revenue30days,
        totalRevenue30dayChange: revenue30daysBefore
          ? ((revenue30days - revenue30daysBefore) / revenue30daysBefore) * 100
          : 0,
        countInvoiceToday: totalInvoiceToday,
        countInvoiceTodayChange: totalInvoiceYesterday
          ? ((totalInvoiceToday - totalInvoiceYesterday) /
              totalInvoiceYesterday) *
            100
          : 0,
      },
      appointment: {
        totalAppointmentToday: todayAppointment,
        totalAppointmentYesterday: yesterdayAppointment,
        totalAppointmentTodayChange: yesterdayAppointment
          ? ((todayAppointment - yesterdayAppointment) / yesterdayAppointment) *
            100
          : 0,
        totalAppointment7days: appointment7days,
        totalAppointment7dayChange: appointment7daysBefore
          ? ((appointment7days - appointment7daysBefore) /
              appointment7daysBefore) *
            100
          : 0,
        totalAppointment30days: appointment30days,
        totalAppointment30dayChange: appointment30daysBefore
          ? ((appointment30days - appointment30daysBefore) /
              appointment30daysBefore) *
            100
          : 0,
      },
      invoice: {
        totalInvoiceToday: totalInvoiceToday,
        totalInvoiceYesterday: totalInvoiceYesterday,
        totalInvoiceTodayChange: totalInvoiceYesterday
          ? ((totalInvoiceToday - totalInvoiceYesterday) /
              totalInvoiceYesterday) *
            100
          : 0,
        totalInvoice7days: totalInvoice7days,
        totalInvoice7dayChange: totalInvoice7daysBefore
          ? ((totalInvoice7days - totalInvoice7daysBefore) /
              totalInvoice7daysBefore) *
            100
          : 0,
        totalInvoice30days: totalInvoice30days,
        totalInvoice30dayChange: totalInvoice30daysBefore
          ? ((totalInvoice30days - totalInvoice30daysBefore) /
              totalInvoice30daysBefore) *
            100
          : 0,
      },
    };
  }
  getTotalAppointmentToday(branchId: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return this.appointmentModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: 'accepted',
      branchId: branchId,
    });
  }

  getTotalAppointmentYesterday(branchId: string) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0));
    const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999));

    return this.appointmentModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: 'accepted',
      branchId: branchId,
    });
  }

  getTotalAppointment7days(branchId: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();

    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    return this.appointmentModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: 'accepted',
      branchId: branchId,
    });
  }

  getTotalAppointment7daysBefore(branchId: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 14);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 7);

    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    return this.appointmentModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: 'accepted',
      branchId: branchId,
    });
  }

  getTotalAppointment30days(branchId: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    return this.appointmentModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: 'accepted',
      branchId: branchId,
    });
  }

  getTotalAppointment30daysBefore(branchId: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 60);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 30);

    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    return this.appointmentModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: 'accepted',
      branchId: branchId,
    });
  }

  async getTotalRevenueToday(branchId: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const result = await this.invoiceModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          branchId: branchId,
        },
      },
      {
        $group: {
          _id: '$branchId',
          total: { $sum: '$total_amount' },
        },
      },
    ]);
    return result[0]?.total || 0;
  }

  async getTotalRevenueYesterday(branchId: string) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0));
    const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999));

    const result = await this.invoiceModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          branchId: branchId,
        },
      },
      {
        $group: {
          _id: '$branchId',
          total: { $sum: '$total_amount' },
        },
      },
    ]);
    return result[0]?.total || 0;
  }

  async getTotalRevenue7days(branchId: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();
    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    const result = await this.invoiceModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          branchId: branchId,
        },
      },
      {
        $group: {
          _id: '$branchId',
          total: { $sum: '$total_amount' },
        },
      },
    ]);
    return result[0]?.total || 0;
  }

  async getTotalRevenue7dayBefore(branchId: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 14);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 7);
    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    const result = await this.invoiceModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          branchId: branchId,
        },
      },
      {
        $group: {
          _id: '$branchId',
          total: { $sum: '$total_amount' },
        },
      },
    ]);
    return result[0]?.total || 0;
  }

  async getTotalRevenue30days(branchId: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();
    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    const result = await this.invoiceModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          branchId: branchId,
        },
      },
      {
        $group: {
          _id: '$branchId',
          total: { $sum: '$total_amount' },
        },
      },
    ]);
    return result[0]?.total || 0;
  }

  async getTotalRevenue30dayBefore(branchId: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 60);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 30);
    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    const result = await this.invoiceModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          branchId: branchId,
        },
      },
      {
        $group: {
          _id: '$branchId',
          total: { $sum: '$total_amount' },
        },
      },
    ]);
    return result[0]?.total || 0;
  }

  getTotalInvoiceToday(branchId: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return this.invoiceModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      branchId: branchId,
    });
  }

  getTotalInvoiceYesterday(branchId: string) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0));
    const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999));

    return this.invoiceModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      branchId: branchId,
    });
  }

  getTotalInvoice7days(branchId: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();
    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    return this.invoiceModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      branchId: branchId,
    });
  }

  getTotalInvoice7daysBefore(branchId: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 14);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 7);
    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    return this.invoiceModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      branchId: branchId,
    });
  }

  getTotalInvoice30days(branchId: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();
    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    return this.invoiceModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      branchId: branchId,
    });
  }

  getTotalInvoice30daysBefore(branchId: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 60);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 30);
    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    return this.invoiceModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      branchId: branchId,
    });
  }
}
