import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VoucherCode, VoucherCodeDocument } from '../schemas/voucher-code.schema';
import { CreateVoucherDto } from '../dtos/create-voucher.dto';

@Injectable()
export class VoucherCodeRepository {
  constructor(
    @InjectModel(VoucherCode.name) private voucherCodeModel: Model<VoucherCodeDocument>,
  ) {}

  async create(createVoucherDto: CreateVoucherDto, code: string): Promise<VoucherCode> {
    const newVoucher = new this.voucherCodeModel({ ...createVoucherDto, code });
    return newVoucher.save();
  }

  async findByCode(code: string): Promise<VoucherCode | null> {
    return this.voucherCodeModel.findOne({ code }).exec();
  }

  async findAllByCustomerEmail(customerEmail: string): Promise<VoucherCode[]> {
    return this.voucherCodeModel.find({ customerEmail }).exec();
  }

  async markAsUsed(code: string): Promise<VoucherCode | null> {
    return this.voucherCodeModel
      .findOneAndUpdate({ code }, { usedAt: new Date() }, { new: true })
      .exec();
  }
}
