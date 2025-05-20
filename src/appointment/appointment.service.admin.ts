import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  Appointment,
  AppointmentDocument,
  AppointmentStatus,
} from 'src/schemas/appointments.schema';
import {
  HairStylist,
  HairStylistDocument,
} from 'src/schemas/hair-stylist.schemas';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Branch, BranchDocument } from 'src/schemas/branchs.schema';
import { Service, ServiceDocument } from 'src/schemas/services.schema';
import { ResponseDto } from 'src/common/dto/response.dto';
import { HttpStatus } from 'src/common/constants/http-status.enum';
import { HttpMessage } from 'src/common/constants/http-message.enum';
import { GetAppointmentAdminDto } from './dto/get-appointment-admin.dto';
import { Admin } from 'src/common/decorator/admin.decorator';
import { AdminDocument } from 'src/schemas/admin.schema';
@Injectable()
export class AppointmentAdminService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(HairStylist.name)
    private stylistModel: Model<HairStylistDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Branch.name)
    private branchModel: Model<BranchDocument>,
    @InjectModel(Service.name)
    private serviceModel: Model<ServiceDocument>,
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
  ) {}

  async findAll(user: any, query: GetAppointmentAdminDto) {
    const findAdmin = await this.adminModel.findById(user.id);
    if (!findAdmin) {
      throw new BadRequestException('Admin not found');
    }

    const { status, page, limit, search } = query;
    const skip = (page - 1) * limit;
    const queryBuilder = this.appointmentModel.find();
    queryBuilder.where('branchId', findAdmin.branchId);

    if (status !== 'all') {
      queryBuilder.where('status', status);
    }
    if (search) {
      queryBuilder.or([
        { phone: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ]);
    }

    const [total, appointments] = await Promise.all([
      this.appointmentModel.countDocuments(queryBuilder.getQuery()),
      queryBuilder
        .populate({
          path: 'customerId',
          select: 'username',
        })
        .populate({
          path: 'serviceId',
          select: 'name',
        })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const appointmentResponse = appointments.map((appointment) => {
      return {
        id: appointment._id,
        username: appointment.customerId['username'],
        phone: appointment.phone,
        date: appointment.date,
        service: appointment.serviceId['name'],
        status: appointment.status,
        notes: appointment.notes,
      };
    });

    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, {
      appointments: appointmentResponse,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async updateStatus(id: string, status: any) {
    const findAppointment = await this.appointmentModel.findById(id);
    if (!findAppointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (status.status === AppointmentStatus.ACCEPTED) {
      findAppointment.status = AppointmentStatus.ACCEPTED;
    } else if (status.status === AppointmentStatus.CANCELLED) {
      findAppointment.status = AppointmentStatus.CANCELLED;
    }
    await findAppointment.save();

    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, {
      message: 'Appointment status updated successfully',
    });
  }
}
