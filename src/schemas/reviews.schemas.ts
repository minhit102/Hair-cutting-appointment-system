import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: false })
  review: string;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ required: false, default: false })
  isDeleted: Boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.set('collection', 'reviews');
