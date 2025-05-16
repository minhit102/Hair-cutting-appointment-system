import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'HairStylist', required: true })
  stylistId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ required: false, default: false })
  isDeleted: Boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.set('collection', 'reviews');
