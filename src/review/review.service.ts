import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from '../schemas/reviews.schemas';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const newReview = await this.reviewModel.create(createReviewDto);
    return newReview;
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find().exec();
  }

  async findByStylistId(stylistId: string): Promise<Review[]> {
    return this.reviewModel.find({ hairStylistId: stylistId }).exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  //   async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
  //     const updatedReview = await this.reviewModel
  //       .findByIdAndUpdate(id, updateReviewDto, { new: true })
  //       .exec();
  //     if (!updatedReview) {
  //       throw new NotFoundException('Review not found');
  //     }
  //     return updatedReview;
  //   }

  async remove(id: string): Promise<Review> {
    const deletedReview = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!deletedReview) {
      throw new NotFoundException('Review not found');
    }
    return deletedReview;
  }

  async getAverageRating(stylistId: string): Promise<number> {
    const reviews = await this.reviewModel.find({ hairStylistId: stylistId });
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }
}
