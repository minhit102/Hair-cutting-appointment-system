import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceAdminService } from './service.admin.service';
@Controller('/admin/service')
export class ServiceAdminController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly serviceAdminService: ServiceAdminService,
  ) {}

  @Get()
  async getListService() {
    return this.serviceService.getListService();
  }

  @Post()
  async createService(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.createService(createServiceDto);
  }

  @Put(':id')
  async updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceAdminService.updateService(id, updateServiceDto);
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    return this.serviceAdminService.deleteService(id);
  }
}
