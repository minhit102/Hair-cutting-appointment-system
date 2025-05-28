import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/common/decorator/user.decorator';
import { DashbroadService } from './dashbroad.service';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';

@Controller('admin/dashboard')
export class DashbroadController {
  constructor(private readonly dashbroadService: DashbroadService) {}

  @Get('change-revenue')
  @UseGuards(JwtAuthGuard)
  async getChangeRevenue(@User() user: any) {
    return this.dashbroadService.getChangeRevenue(user);
  }

  @Get('revenue-chart-day')
  @UseGuards(JwtAuthGuard)
  async getRevenueChartDay(@User() user: any) {
    return this.dashbroadService.getRevenueChartDay(user);
  }

  @Get('revenue-chart-month')
  @UseGuards(JwtAuthGuard)
  async getRevenueChartMonth(@User() user: any) {
    return this.dashbroadService.getRevenueChartMonth(user);
  }
}
