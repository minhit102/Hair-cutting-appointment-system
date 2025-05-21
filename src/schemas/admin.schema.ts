import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

export enum AdminRole {
  ADMIN = 'ADMIN',
  RECEPTIONIST = 'RECEPTIONIST',
}

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

  @Prop({ required: false, default: false })
  isActive: Boolean;

  @Prop({ type: Types.ObjectId, ref: 'Branch' })
  branchId: Types.ObjectId;

  @Prop({ required: false, default: AdminRole.ADMIN })
  role: AdminRole;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
AdminSchema.set('collection', 'admin');
