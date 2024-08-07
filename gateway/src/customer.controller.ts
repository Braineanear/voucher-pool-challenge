import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(@Inject('CUSTOMER_SERVICE') private readonly customerServiceClient: ClientProxy,) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The customer has been successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data.' })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const response = await firstValueFrom(
      this.customerServiceClient.send('create_customer', createCustomerDto),
    );

    return response;
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved all customers.' })
  async findAll() {
    const response = await firstValueFrom(
      this.customerServiceClient.send('get_customers', {})
    );

    return response;
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get a customer by email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved the customer.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found.' })
  async findOne(@Param('email') email: string) {
    const response = await firstValueFrom(
      this.customerServiceClient.send('get_customer', { email })
    );

    return response;
  }

  @Put(':email')
  @ApiOperation({ summary: 'Update a customer by email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The customer has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found.' })
  async update(
    @Param('email') email: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const response = await firstValueFrom(
      this.customerServiceClient.send('update_customer', { email, payload: updateCustomerDto })
    );

    return response;
  }

  @Delete(':email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a customer by email' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The customer has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found.' })
  async remove(@Param('email') email: string): Promise<void> {
    const response = await firstValueFrom(
      this.customerServiceClient.send('delete_customer', { email })
    );

    return response;
  }
}
