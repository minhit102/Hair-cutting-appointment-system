import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Appointment } from './appointments.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  customerId?: Types.ObjectId;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'HairStylist', required: true })
  stylistId: Types.ObjectId;

  @Prop({ type: String, required: false })
  phone?: string;

  @Prop({ type: Number, required: true })
  total_amount: number;

  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  serviceId: Types.ObjectId;

  @Prop({ type: Boolean, required: false, default: false })
  isDeleted: boolean;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
InvoiceSchema.set('collection', 'invoices');
