import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { NotificationType } from 'src/common/enum/notification-type';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  recipientId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  title: string;
  @Prop({
    type: String,
    required: true,
  })
  message: string;

  @Prop({
    required: true,
    enum: NotificationType,
    type: String,
  })
  type: NotificationType;

  @Prop({
    type: Boolean,
    default: false,
  })
  isRead: boolean;
  @Prop({
    type: Date,
    default: Date.now,
  })
  timestamp: Date;

  @Prop({
    type: String,
  })
  actionUrl: string;
  @Prop({
    type: Date,
    required: false,
  })
  scheduledAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
