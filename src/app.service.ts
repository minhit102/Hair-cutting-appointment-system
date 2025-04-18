import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor() {}
  getHello() {
    return ' Hello World!';
  }
}
