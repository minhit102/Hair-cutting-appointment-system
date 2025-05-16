import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false, default: false })
  isDeleted: Boolean;

  @Prop({ type: Types.ObjectId, ref: 'Branch' })
  branchId: Types.ObjectId;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
AdminSchema.set('collection', 'admin');
