import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { HttpMessage } from 'src/common/constants/http-message.enum';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from 'src/schemas/orders.schema';
import { GetOrderParamsDto } from './dto/get-order.dto';
import { NotificationType } from 'src/common/enum/notification-type';
import { User, UserDocument } from 'src/schemas/user.schema';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { Role } from 'src/common/enum/role.enum';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly notificationsGateway: NotificationGateway,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<ResponseDto<any>> {
    const {
      customerId,
      items,
      paymentStatus,
      delivery,
      discount,
      tax,
      shippingCost,
      customerName,
    } = createOrderDto;

    const productIds = items.map((item) => item.productId);
    const uniqueProductIds = [...new Set(productIds)];
    const products = await this.productModel.find({
      _id: { $in: uniqueProductIds },
    });
    if (uniqueProductIds.length !== products.length) {
      throw new BadRequestException('Some product IDs do not exist');
    }
    const convertedItems = items.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString(),
      );
      const quantity = item.quantity;
      const salePrice = product.salePrice;
      const totalItem = quantity * salePrice;
      console.log(product);
      return {
        productId: item.productId,
        productName: product.title,
        category: product.category,
        images: product.images,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: salePrice,
        total: totalItem,
      };
    });
    const subTotal = convertedItems.reduce((acc, item) => acc + item.total, 0);
    const total = subTotal + tax + shippingCost - discount;
    const newOrder = await this.orderModel.create({
      customerId,
      customerName,
      paymentStatus,
      delivery,
      discount,
      tax,
      shippingCost,
      items: convertedItems,
      subTotal,
      total: total > 0 ? total : 0,
    });

    const admins = await this.userModel.find({ role: Role.Admin });
    await Promise.all(
      admins.map(async (admin) => {
        this.notificationModel.create({
          title: 'Đặt hàng thành công',
          message: `${customerName} đặt hàng thành công `,
          type: NotificationType.ORDER_STATUS,
          recipientId: admin._id.toString(),
        });
      }),
    );
    this.notificationsGateway.handleSendNotification({
      title: 'Đặt hàng thành công',
      message: `Khách hàng ${customerName} đặt hàng thành công`,
      type: NotificationType.ORDER_STATUS,
      order: newOrder,
    });
    return new ResponseDto(HttpStatus.CREATED, HttpMessage.CREATED, newOrder);
  }

  async getListOrder(
    getOrderParamsDto: GetOrderParamsDto,
  ): Promise<ResponseDto<any>> {
    const {
      page,
      limit,
      sortBy,
      order,
      completeStatus,
      paymentStatus,
      delivery,
      keyWord,
    } = getOrderParamsDto;
    const sortField = sortBy || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const filter: any = {};
    if (completeStatus) filter.completeStatus = completeStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (delivery) filter.delivery = delivery;
    if (keyWord) filter.customerName = { $regex: keyWord, $options: 'i' };
    const [total, listOrder] = await Promise.all([
      this.orderModel.countDocuments(filter).exec(),
      this.orderModel
        .find(filter)
        .sort({ [sortField]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
    ]);
    const totalPages = Math.ceil(total / limit);
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, {
      data: listOrder,
      limit,
      page,
      total,
      totalPages,
    });
  }
  async getOrderDetail(id: string): Promise<ResponseDto<any>> {
    const findOrder = await this.orderModel.findById(id);
    if (!findOrder) {
      throw new BadRequestException('OrderId not exists');
    }
    console.log(findOrder);
    const productIds = findOrder.items.map((item) => item.productId);
    const uniqueProductIds = [...new Set(productIds)];
    const products = await this.productModel.find({
      _id: { $in: uniqueProductIds },
    });
    const convertedItems = findOrder.items.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString(),
      );
      if (!product) {
        throw new BadRequestException(
          `Product with ID ${item.productId} not found`,
        );
      }
      return {
        productId: item.productId,
        productName: product.title,
        productCategory: product?.category,
        productImage: product.images,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: product.salePrice,
        total: item.quantity * product.salePrice,
      };
    });
    const orderDetai = {
      ...findOrder.toObject(),
      items: convertedItems,
    };
    return new ResponseDto(HttpStatus.OK, HttpMessage.OK, orderDetai);
  }
}
