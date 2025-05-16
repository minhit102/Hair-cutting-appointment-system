import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Service, ServiceDocument } from 'src/schemas/services.schema';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
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
    return this.serviceModel.findById(service._id);
  }
}
