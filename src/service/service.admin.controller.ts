import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
@Controller('/admin/service')
export class ServiceAdminController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async getListService() {
    return this.serviceService.getListService();
  }

  @Post()
  async createService(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.createService(createServiceDto);
  }
}
