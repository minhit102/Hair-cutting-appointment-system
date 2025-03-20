import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const newNotification = await this.notificationModel.create(
      createNotificationDto,
    );
    return newNotification;
  }
}
