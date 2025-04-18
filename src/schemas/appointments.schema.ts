import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;

export enum AppointmentStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Done = 'done',
  Cancelled = 'cancelled',
}

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  stylistId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  receptionistId?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Service' }], required: true })
  serviceIds: Types.ObjectId[];

  @Prop({ required: true })
  appointmentTime: Date;

  // Tổng thời gian thực hiện các dịch vụ (đơn vị: giờ)
  @Prop({ required: true })
  totalDuration: number;

  @Prop({ enum: AppointmentStatus, default: AppointmentStatus.Pending })
  status: AppointmentStatus;

  @Prop()
  notes?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
