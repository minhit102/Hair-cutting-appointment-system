import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/strategies/roles.guard';
import { User } from 'src/common/decorator/user.decorator';
import { HairStylistAdminService } from './hair-stylist.service.admin';
import { CreateHairStylistDto } from './dto/create-hair-stylist.dto';
import { GetHairStyleListDto } from './dto/getHairStyleList.dto';
import { UpdateHairStylistDto } from './dto/update-hair-stylist.dto';

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
  @UseGuards(JwtAuthGuard)
  getStylistByBranchId(@User() user: any, @Query() query: GetHairStyleListDto) {
    return this.hairStylistAdminService.findAllByAdminId({
      id: user.id,
      query,
    });
  }

  @Get(':id/detail')
  @UseGuards(JwtAuthGuard)
  getStylistDetail(@Param('id') id: string): Promise<any> {
    return this.hairStylistAdminService.getStylistDetailById({
      id,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateStylist(@Param('id') id: string, @Body() body: UpdateHairStylistDto) {
    return this.hairStylistAdminService.updateStylist({
      id,
      body,
    });
  }
}
