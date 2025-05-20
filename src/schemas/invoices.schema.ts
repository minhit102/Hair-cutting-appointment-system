import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Appointment } from './appointments.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  customerId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Stylist', required: true })
  hairStylistId: Types.ObjectId;

  @Prop({ type: String, required: false })
  phone?: string;

  @Prop({ type: Date, required: true })
  time: Date;

  @Prop({ type: Number, required: true })
  total_amount: number;

  @Prop({ type: Number, required: true })
  discount_amount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Service' }], required: true })
  services: Types.ObjectId[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
InvoiceSchema.set('collection', 'invoices');
