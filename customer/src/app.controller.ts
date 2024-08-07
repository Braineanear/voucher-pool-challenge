import { Controller } from '@nestjs/common';
import { CustomerService } from './app.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { Customer } from './schemas/customer.schema';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern('create_customer')
  create(@Payload() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  @MessagePattern('get_customers')
  findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @MessagePattern('get_customer')
  findOne(@Payload('email') email: string): Promise<Customer> {
    return this.customerService.findOne(email);
  }

  @MessagePattern('update_customer')
  update(
    @Payload('email') email: string,
    @Payload('payload') updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.update(email, updateCustomerDto);
  }

  @MessagePattern('delete_customer')
  remove(@Payload('email') email: string): Promise<void> {
    return this.customerService.remove(email);
  }
}
