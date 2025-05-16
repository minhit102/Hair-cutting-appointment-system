import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/strategies/roles.guard';
import { User } from 'src/common/decorator/user.decorator';
import { HairStylistAdminService } from './hair-stylist.service.admin';
import { CreateHairStylistDto } from './dto/create-hair-stylist.dto';

@Controller('admin/hair-stylist')
export class HairStylistAdminController {
  constructor(
    private readonly hairStylistAdminService: HairStylistAdminService,
  ) {}
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getStylistById(@Param('id') id: string, @User() user: any) {
    return this.hairStylistAdminService.findAllByBranchId({
      id,
      user,
    });
  }

  @Get()
  tess() {
    return 'test';
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @User() user: any,
    @Body() createHairStylistDto: CreateHairStylistDto,
  ) {
    return this.hairStylistAdminService.create(createHairStylistDto, user);
  }
}
