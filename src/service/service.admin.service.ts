import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Service, ServiceDocument } from 'src/schemas/services.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceAdminService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async getListService() {
    const services = await this.serviceModel.find({
      isActive: true,
    });
    return services;
  }

  async createService(createServiceDto: CreateServiceDto) {
    const service = await this.serviceModel.create(createServiceDto);
    return service;
  }

  async updateService(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceModel.findByIdAndUpdate(
      id,
      updateServiceDto,
      {
        new: true,
      },
    );
    return service;
  }

  async deleteService(id: string) {
    const service = await this.serviceModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    return service;
  }
}
