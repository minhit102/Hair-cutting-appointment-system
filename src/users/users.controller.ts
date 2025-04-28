import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RolesGuard } from 'src/common/strategies/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetCustomerParamsDto } from './dto/get-customer.dto';
import { CreateUserEntityDto } from './dto/create-user-entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/get-user.decorator';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('list-customer')
  async getListCustomer(@Query() getCustomerParamsDto: GetCustomerParamsDto) {
    return this.usersService.getListCustomer(getCustomerParamsDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Customer)
  @Get(':id')
  async getCustomerDetail(@Param('id') id: string) {
    return this.usersService.getCustomerDetail(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Customer)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.getProfileUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Customer)
  @Put('profile')
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  // @Post()
  // addUser(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.addUser(createUserDto);
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  // @Post()
  // updateImageAvt(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.addUser(createUserDto);
  // }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async updateAvt(@UploadedFile() file: Express.Multer.File, @GetUser() user) {
    return this.usersService.updateAvt({ userId: user.id, file }); // hoặc truyền trực tiếp nếu service không cần array
  }

  // @Post('createUser')
  // creatUser(@Body() createUserEntityDto: CreateUserEntityDto) {
  //   return this.usersService.creatUser(createUserEntityDto);
  // }
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin, Role.Customer)
  // @Get(':id')
  // async getUserById(@Param('id') id: string) {
  //   return this.usersService.getProfileUser(id);
  // }
}
