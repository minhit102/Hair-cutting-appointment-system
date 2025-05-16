import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SalaryDocument = HydratedDocument<Salary>;

@Schema({ timestamps: true })
export class Salary {
  @Prop({ type: Types.ObjectId, ref: 'HairStylist', required: true })
  stylistId: Types.ObjectId;

  @Prop({ required: true })
  month: number;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, default: 0 })
  baseSalary: number;

  @Prop({ required: true, default: 0 })
  bonus: number;

  @Prop({ required: false })
  note: string;

  @Prop({ required: false })
  paymentDate: Date;
}

export const SalarySchema = SchemaFactory.createForClass(Salary);
