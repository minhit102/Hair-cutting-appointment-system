import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HairstyleDocument = HydratedDocument<Hairstyle>;

@Schema({ timestamps: true })
export class Hairstyle {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: false })
  sampleVideoUrl?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const HairstyleSchema = SchemaFactory.createForClass(Hairstyle);
HairstyleSchema.set('collection', 'hairstyles');
