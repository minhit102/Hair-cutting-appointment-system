import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/common/enum/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ unique: false })
  phone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: true, enum: Role, type: String, default: Role.Customer })
  role: Role;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;

  @Prop({ required: false, default: false })
  isDeleted: Boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
