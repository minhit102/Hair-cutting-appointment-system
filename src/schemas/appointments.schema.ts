import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Service } from './services.schema';

export type AppointmentDocument = HydratedDocument<Appointment>;

export enum AppointmentStatus {
  ACCEPTED = 'accepted',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: false })
  hairStylistId: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  serviceId: Types.ObjectId;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: false })
  notes?: string;

  @Prop({
    type: String,
    enum: AppointmentStatus,
    default: AppointmentStatus.ACCEPTED,
  })
  status: AppointmentStatus;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
AppointmentSchema.set('collection', 'appointments');
