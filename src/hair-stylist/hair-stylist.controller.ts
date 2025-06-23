import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/common/decorator/user.decorator';
import { HairStylistService } from './hair-stylist.service';

@Controller('hair-styles')
export class HairStylistController {
  constructor(private readonly hairStylistService: HairStylistService) {}

  @Get('list')
  getStyles() {
    return this.hairStylistService.getAll();
  }

  @Post()
  createStyleHair() {
    return this.hairStylistService.createStyleHair({
      id: '3',
      name: 'toc dai',
      textPrompt:
        'Apply a long wavy hairstyle for men with a clean middle part. The hair is about 6 to 8 inches long, flowing naturally past the ears with soft waves. The texture is light and voluminous, styled to frame the face symmetrically. Hair color should be natural black. Keep the face, facial features, skin tone, lighting, and background completely unchanged',
      imageUrl:
        'https://barbershopvutri.com/wp-content/uploads/2019/07/69b57147dcb6c0817eb5dc8c194c7623.jpg',
    });
  }

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
