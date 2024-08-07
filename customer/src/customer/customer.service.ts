import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from './repositories/customer.repository';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { Customer } from './schemas/customer.schema';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerRepository.create(createCustomerDto);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async findOne(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne(email);
    if (!customer) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }
    return customer;
  }

  async update(email: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const updatedCustomer = await this.customerRepository.update(email, updateCustomerDto);
    if (!updatedCustomer) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }
    return updatedCustomer;
  }

  async remove(email: string): Promise<void> {
    const result = await this.customerRepository.remove(email);
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }
  }
}
