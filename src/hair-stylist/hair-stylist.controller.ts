import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/common/decorator/user.decorator';
import { HairStylistService } from './hair-stylist.service';

@Controller('hair-styles')
export class HairStylistController {
  constructor(private readonly hairStylistService: HairStylistService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  getStylistByBranchId(@Query('branchId') branchId: string, @User() user: any) {
    return this.hairStylistService.findAll(user, branchId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getStylistById(@Param('id') id: string) {
    return this.hairStylistService.findById(id);
  }
}
