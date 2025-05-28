import {
  Controller,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from 'src/common/decorator/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { GetAppointmentAdminDto } from './dto/get-appointment-admin.dto';
import { AppointmentAdminService } from './appointment.service.admin';

@Controller('admin/appointments')
export class AppointmentAdminController {
  constructor(
    private readonly appointmentAdminService: AppointmentAdminService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@User() user: any, @Query() query: GetAppointmentAdminDto) {
    return this.appointmentAdminService.findAll(user, query);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body() status: any) {
    return this.appointmentAdminService.updateStatus(id, status);
  }
}
