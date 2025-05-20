import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/common/enum/role.enum';

export type HairStylistDocument = HydratedDocument<HairStylist>;

export enum HairStylistStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class HairStylist {
  @Prop({ required: true })
  username: string;

  @Prop({ unique: false })
  phone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false })
  address: string;

  @Prop({
    required: false,
    default:
      'https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/18/457/avatar-mac-dinh-1.jpg',
  })
  imgAvt: string;

  @Prop({
    required: false,
    default:
      'https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/18/457/avatar-mac-dinh-1.jpg',
  })
  imgBackground: string;

  @Prop({ required: false, default: false })
  isDeleted: Boolean;

  @Prop({ required: false, default: 0 })
  salaryBase: number;

  @Prop({ type: Types.ObjectId, ref: 'Branch' })
  branchId: Types.ObjectId;

  @Prop({ required: false, default: HairStylistStatus.ACTIVE })
  status: HairStylistStatus;
}

export const HairStylistSchema = SchemaFactory.createForClass(HairStylist);
HairStylistSchema.set('collection', 'hair-stylists');
