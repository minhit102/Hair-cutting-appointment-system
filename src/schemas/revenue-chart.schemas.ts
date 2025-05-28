import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RevenueChartDocument = HydratedDocument<RevenueChart>;

@Schema({ timestamps: true })
export class RevenueChart {
  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop({ required: true })
  totalRevenue: number;

  @Prop({ required: true })
  createdAt: Date;
}

export const RevenueChartSchema = SchemaFactory.createForClass(RevenueChart);
