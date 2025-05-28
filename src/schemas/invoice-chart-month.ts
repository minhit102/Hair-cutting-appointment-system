import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type InvoiceChartMonthDocument = HydratedDocument<InvoiceChartMonth>;

@Schema({ timestamps: true })
export class InvoiceChartMonth {
  @Prop({ required: true })
  date: string;

  @Prop({ type: Types.ObjectId, ref: 'Branch' })
  branchId: Types.ObjectId;

  @Prop({ required: true })
  totalRevenue: number;

  @Prop({ required: true })
  totalAppointment: number;
}

export const InvoiceChartMonthSchema =
  SchemaFactory.createForClass(InvoiceChartMonth);
InvoiceChartMonthSchema.set('collection', 'invoice-chart-month');
