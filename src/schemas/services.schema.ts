import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ServiceDocument = HydratedDocument<Service>;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: false })
  image: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  popular: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
ServiceSchema.set('collection', 'services');
