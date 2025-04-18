import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BranchDocument = HydratedDocument<Branch>;

@Schema({ timestamps: true })
export class Branch {
  //   @Prop({ required: true, unique: true })
  //   branchId: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: false,
    type: {
      street: { type: String },
      ward: { type: String },
      district: { type: String },
      city: { type: String },
      country: { type: String },
    },
    _id: false,
  })
  address: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    country?: string;
  };

  @Prop({
    required: false,
    type: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' },
    },
    _id: false,
  })
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  managers: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
