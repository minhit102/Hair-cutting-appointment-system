import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type InvoiceChartDayDocument = HydratedDocument<InvoiceChartDay>;

@Schema({ timestamps: true })
export class InvoiceChartDay {
  @Prop({ required: true })
  date: string;

  @Prop({ type: Types.ObjectId, ref: 'Branch' })
  branchId: Types.ObjectId;

  @Prop({ required: true })
  totalRevenue: number;

  @Prop({ required: true })
  totalAppointment: number;
}

export const InvoiceChartDaySchema =
  SchemaFactory.createForClass(InvoiceChartDay);
InvoiceChartDaySchema.set('collection', 'invoice-chart-day');
