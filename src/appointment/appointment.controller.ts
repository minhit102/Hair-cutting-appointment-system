import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from 'src/common/decorator/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @User() user: any,
  ) {
    return this.appointmentService.create({ createAppointmentDto, user });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@User() user: any) {
    return this.appointmentService.findAll(user);
  }

  @Put(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.appointmentService.cancel(id);
  }
}
