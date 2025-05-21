import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from '../schemas/invoices.schema';
import { CreateInvoiceDto } from './dto/create-invoices.dto';
import { Service, ServiceDocument } from 'src/schemas/services.schema';
import {
  HairStylist,
  HairStylistDocument,
} from 'src/schemas/hair-stylist.schemas';
import { Branch, BranchDocument } from 'src/schemas/branchs.schema';
import { User, UserDocument, UserSchema } from 'src/schemas/user.schema';
import { Admin, AdminDocument } from 'src/schemas/admin.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(HairStylist.name)
    private stylistModel: Model<HairStylistDocument>,
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async create({
    user,
    createInvoiceDto,
  }: {
    user: any;
    createInvoiceDto: CreateInvoiceDto;
  }) {
    const receipt = await this.adminModel.findById(user.id);
    const { stylistId, total_amount, serviceId, customerId } = createInvoiceDto;
    const stylist = await this.stylistModel.findById(stylistId);
    const service = await this.serviceModel.findById(serviceId);
    if (!stylist) {
      throw new BadRequestException('Stylist not found');
    }
    if (!service) {
      throw new BadRequestException('Service not found');
    }
    if (!createInvoiceDto.customerId) {
      const randomId = Math.floor(1000 + Math.random() * 9000); // tạo số ngẫu nhiên từ 1000–9999
      let username = 'Customer ' + randomId;
      const invoice = new this.invoiceModel({
        stylistId: stylistId,
        total_amount: total_amount ? total_amount : service.price,
        serviceId: serviceId,
        phone: createInvoiceDto.phone || '',
        branchId: receipt.branchId,
        username: username,
      });
      return await invoice.save();
    }
    const customer = await this.userModel.findById(customerId);

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    const invoice = new this.invoiceModel({
      customerId: customer._id.toString(),
      stylistId: stylist._id.toString(),
      total_amount: total_amount ? total_amount : service.price,
      serviceId: service._id.toString(),
      phone: createInvoiceDto.phone,
      branchId: receipt.branchId.toString(),
      username: customer.username,
    });
    await invoice.save();
    return invoice;
  }

  async findAll({ user }: { user: any }) {
    const admin = await this.adminModel.findById(user.id);
    const invoices = await this.invoiceModel
      .find({
        branchId: admin.branchId,
      })
      .populate('customerId')
      .populate('stylistId')
      .populate('serviceId');
    return invoices;
  }

  async findByUser({ user }: { user: any }) {
    const invoices = await this.invoiceModel
      .find({
        customerId: user.id,
      })
      .populate('customerId')
      .populate('stylistId')
      .populate('serviceId')
      .populate('branchId');

    const invoiceConvert = invoices.map((invoice) => {
      return {
        id: invoice._id,
        date: (invoice as any).createdAt,
        service: invoice.serviceId['name'],
        stylist: invoice.stylistId['username'],
        stylistId: invoice.stylistId['_id'],
        serviceId: invoice.serviceId['_id'],
        total: invoice.total_amount,
        phone: invoice.phone,
        branchId: invoice.branchId['_id'],
        branch: invoice.branchId['name'],
        username: invoice.username,
      };
    });
    return invoiceConvert;
  }
}
