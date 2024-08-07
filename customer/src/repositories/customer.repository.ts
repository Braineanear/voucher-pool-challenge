import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../schemas/customer.schema';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const newCustomer = new this.customerModel(createCustomerDto);
    return newCustomer.save();
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec();
  }

  async findOne(email: string): Promise<Customer | null> {
    return this.customerModel.findOne({ email }).exec();
  }

  async update(email: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer | null> {
    return this.customerModel
      .findOneAndUpdate({ email }, updateCustomerDto, { new: true })
      .exec();
  }

  async remove(email: string): Promise<{ deletedCount?: number }> {
    return this.customerModel.deleteOne({ email }).exec();
  }
}
