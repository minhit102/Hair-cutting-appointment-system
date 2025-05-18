import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BranchDocument = HydratedDocument<Branch>;

// Tạo schema con cho location
@Schema({ _id: false })
class GeoLocation {
  @Prop({ type: String, enum: ['Point'], required: true })
  type: 'Point';

  @Prop({ type: [Number], required: true }) // [longitude, latitude]
  coordinates: [number, number];
}

export const GeoLocationSchema = SchemaFactory.createForClass(GeoLocation);

@Schema({ timestamps: true })
export class Branch {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: {
      street: String,
      ward: String,
      district: String,
      city: String,
      country: String,
    },
    _id: false,
  })
  address?: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    country?: string;
  };

  @Prop({ type: GeoLocationSchema, required: true })
  location: GeoLocation;

  @Prop({
    default:
      'https://xuongmocgocongnghiep.com/upload/images/kinh-nghiem-mo-tiem-cat-toc-nam-3(1).jpg',
  })
  imgSalon: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
BranchSchema.set('collection', 'branchs');
BranchSchema.index({ location: '2dsphere' });
