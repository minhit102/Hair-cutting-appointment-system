import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type WalletBlockDocument = HydratedDocument<WalletBlock>;

@Schema({ timestamps: true })
export class WalletBlock {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  customerId: User;
  @Prop({ required: true, type: String })
  publicAddress: string;

  @Prop({ required: true, type: Boolean, default: false })
  verified: boolean;
}

export const WalletBlockSchema = SchemaFactory.createForClass(WalletBlock);
