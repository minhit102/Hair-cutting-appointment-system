import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HairstyleDocument = HydratedDocument<Hairstyle>;

@Schema({ timestamps: true })
export class Hairstyle {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  textPrompt: string;

  @Prop({ required: true })
  imageUrl: string;
}

export const HairstyleSchema = SchemaFactory.createForClass(Hairstyle);
HairstyleSchema.set('collection', 'hairstyles');
