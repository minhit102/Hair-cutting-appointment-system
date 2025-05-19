import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import {
  Appointment,
  AppointmentSchema,
} from 'src/schemas/appointments.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Branch, BranchSchema } from 'src/schemas/branchs.schema';
import { Service, ServiceSchema } from 'src/schemas/services.schema';
import {
  HairStylist,
  HairStylistSchema,
} from 'src/schemas/hair-stylist.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: HairStylist.name, schema: HairStylistSchema },
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
