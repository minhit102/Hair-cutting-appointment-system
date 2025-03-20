import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { GetOrderParamsDto } from './dto/get-order.dto';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/strategies/roles.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Customer)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async getListOrder(@Query() getOrderParamsDto: GetOrderParamsDto) {
    return this.ordersService.getListOrder(getOrderParamsDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Customer)
  @Get(':id')
  async getOrderDetail(@Param('id') id: string) {
    return this.ordersService.getOrderDetail(id);
  }
}
