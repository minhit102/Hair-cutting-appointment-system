import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
@Injectable()
export class AppointmentService {
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
  ) {}

  async create({
    createAppointmentDto,
    user,
  }: {
    createAppointmentDto: CreateAppointmentDto;
    user: any;
  }) {
    const { branchId, date, serviceId, phone, notes, username } =
      createAppointmentDto;

    const [findUser, branch, service] = await Promise.all([
      this.userModel.findById(user.id),
      this.branchModel.findById(branchId),
      this.serviceModel.findById(serviceId),
    ]);

    if (!findUser) {
      throw new BadRequestException('User not found');
    }
    if (!branch) {
      throw new BadRequestException('Branch not found');
    }
    if (!service) {
      throw new BadRequestException('Service not found');
    }

    const [countStylist, countAppointment] = await Promise.all([
      this.stylistModel.countDocuments({ branchId }),
      this.appointmentModel.countDocuments({
        branchId,
        date: new Date(date),
        status: AppointmentStatus.ACCEPTED,
      }),
    ]);

    if (countAppointment >= countStylist) {
      throw new BadRequestException('Appointment is full at this time');
    }

    const newAppointment = await this.appointmentModel.create({
      branchId,
      customerId: findUser._id,
      serviceId,
      phone,
      date: new Date(date),
      notes,
      username: username ? username : findUser.username,
    });

    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, newAppointment);
  }

  async findAll({ user }: { user: any }) {
    const appointments = await this.appointmentModel.find({
      customerId: user.id,
    });
    return appointments;
  }

  // async updateAppointmentStatus({id, user}: {id: string, user: any}) {
  //   const appointment = await this.appointmentModel.findById(id);
  //   if (!appointment) {
  //     throw new BadRequestException('Appointment not found');
  //   }

  //   await appointment.save();
  //   return appointment;
  // }
  // async findOne(id: string): Promise<Appointment> {
  //   return this.appointmentModel.findById(id).exec();
  // }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Appointment> {
    return this.appointmentModel.findByIdAndDelete(id).exec();
  }

  async findByBranch(branchId: string): Promise<Appointment[]> {
    return this.appointmentModel.find({ branchId }).exec();
  }

  async updateStatus(id: string, status: string): Promise<Appointment> {
    return this.appointmentModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }
}
