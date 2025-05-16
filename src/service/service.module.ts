import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { FileUploadService } from 'src/common/service/file-upload.service';
import { Service, ServiceSchema } from 'src/schemas/services.schema';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceAdminController } from './service.admin.controller';
import { ServiceAdminService } from './service.admin.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Service.name,
        schema: ServiceSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [ServiceController, ServiceAdminController],
  providers: [ServiceService, FileUploadService, ServiceAdminService],
  exports: [ServiceService],
})
export class ServiceModule {}
