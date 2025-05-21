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
import { InvoicesService } from './invoices.service';
import { Invoice } from '../schemas/invoices.schema';
import { CreateInvoiceDto } from './dto/create-invoices.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/common/decorator/user.decorator';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@User() user: any, @Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create({ user, createInvoiceDto });
  }

  @Get('branch')
  @UseGuards(JwtAuthGuard)
  findAll(@User() user: any) {
    return this.invoicesService.findAll({ user });
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  findByUser(@User() user: any) {
    return this.invoicesService.findByUser({ user });
  }
}
