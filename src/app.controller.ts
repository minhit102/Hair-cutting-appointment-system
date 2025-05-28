import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Headers,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import { TasksService } from './schedule/tasks.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post('pre-signed-url')
  async getPreSignedUrl(
    @Body() imageData: { size: number; contentType: string },
  ) {
    return this.appService.getPreSignedUrl(imageData);
  }

  @Post('upload-image-lightX')
  async uploadImageLightX(
    @Body() body: { imageUrl: string; textPrompt: string },
  ) {
    return this.appService.uploadImageLightX(body);
  }

  @Get('order-status/:orderId')
  async getOrderStatus(@Param('orderId') orderId: string) {
    return this.appService.getOrderStatus(orderId);
  }

  @Get('invoice-chart-day')
  async getInvoiceChartDay() {
    return this.tasksService.handleCronDay();
  }

  @Get('invoice-chart-month')
  async getInvoiceChartMonth() {
    return this.tasksService.handleCronMonth();
  }
}
