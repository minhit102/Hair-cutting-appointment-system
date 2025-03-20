import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true })
export class Otp {
  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  otp: string;

  @Prop({
    type: Date,
    required: true,
  })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
