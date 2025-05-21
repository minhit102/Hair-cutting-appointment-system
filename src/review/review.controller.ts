import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../common/guards/auth.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('test')
  test() {
    return 'mimin';
  }

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('stylist/:stylistId')
  findByStylistId(@Param('stylistId') stylistId: string) {
    return this.reviewService.findByStylistId(stylistId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  //   @Patch(':id')
  //   @UseGuards(JwtAuthGuard)
  //   update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
  //     return this.reviewService.update(id, updateReviewDto);
  //   }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }

  @Get('stylist/:stylistId/rating')
  getAverageRating(@Param('stylistId') stylistId: string) {
    return this.reviewService.getAverageRating(stylistId);
  }
}
