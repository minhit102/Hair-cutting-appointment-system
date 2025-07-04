import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from '../schemas/reviews.schemas';
import { CreateReviewDto } from './dto/create-review.dto';
import { Invoice, InvoiceDocument } from 'src/schemas/invoices.schema';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const invoice = await this.invoiceModel.findById(createReviewDto.invoiceId);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    const newReview = await this.reviewModel.create({
      rating: createReviewDto.rating,
      review: createReviewDto.review,
    });
    await this.invoiceModel.findByIdAndUpdate(createReviewDto.invoiceId, {
      $set: { reviewId: newReview._id },
    });
    return newReview;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();
    return updatedReview;
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find().exec();
  }

  async findByStylistId(stylistId: string): Promise<Review[]> {
    return this.reviewModel.find({ hairStylistId: stylistId }).exec();
  }

  async findReviewByStylistId(stylistId: string) {
    const findInvoice = await this.invoiceModel
      .find({ stylistId })
      .populate('reviewId')
      .populate('serviceId');

    // Populate review // Đảm bảo user cũng được populate để dùng invoice.user.name
    const reviews = findInvoice
      .filter((invoice) => invoice.reviewId) // Lọc invoice không có review
      .map((invoice) => ({
        review: invoice.reviewId, // Convert Mongoose document to plain object
        userName: invoice.username || '',
        service: invoice.serviceId, // Thêm tên user nếu có
      }));

    return reviews;
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
