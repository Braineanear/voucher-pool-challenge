import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { ValidateVoucherDto } from './dtos/validate-voucher.dto';

@ApiTags('voucher-codes')
@Controller('voucher-codes')
export class VoucherCodeController {
  constructor(@Inject('VOUCHER_SERVICE') private readonly voucherServiceClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Create a new voucher code' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The voucher code has been successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data.' })
  async create(@Body() createVoucherDto: CreateVoucherDto) {
    const response = await firstValueFrom(
      this.voucherServiceClient.send('create_voucher_code', createVoucherDto),
    );

    return response;
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a voucher code' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The voucher code has been successfully validated.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid voucher code.' })
  async validate(@Body() validateVoucherDto: ValidateVoucherDto): Promise<{ discount: number }> {
    const response = await firstValueFrom(
      this.voucherServiceClient.send('validate_voucher_code', validateVoucherDto),
    );

    const { voucher, discount } = response;
    await firstValueFrom(this.voucherServiceClient.send('mark_voucher_as_used', { code: voucher.code }));

    return { discount };
  }

  @Get('customer/:customerEmail')
  @ApiOperation({ summary: 'Get all vouchers by customer email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved all vouchers for the customer.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found.' })
  async findAllByCustomerEmail(@Param('customerEmail') customerEmail: string) {
    const response = await firstValueFrom(
      this.voucherServiceClient.send('get_vouchers_by_customer', { customerEmail }),
    );

    return response;
  }
}
