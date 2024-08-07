import { Controller, Body, Param } from '@nestjs/common';
import { VoucherCodeService } from './voucher-code.service';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { ValidateVoucherDto } from './dtos/validate-voucher.dto';
import { VoucherCode } from './schemas/voucher-code.schema';
import { MessagePattern } from '@nestjs/microservices';

@Controller('voucher-codes')
export class VoucherCodeController {
  constructor(private readonly voucherCodeService: VoucherCodeService) {}

  @MessagePattern('create_voucher_code')
  create(@Body() createVoucherDto: CreateVoucherDto): Promise<VoucherCode> {
    return this.voucherCodeService.create(createVoucherDto);
  }

  @MessagePattern('validate_voucher_code')
  async validate(@Body() validateVoucherDto: ValidateVoucherDto): Promise<{ discount: number }> {
    const { voucher, discount } = await this.voucherCodeService.validateAndFetchDiscount(validateVoucherDto);
    await this.voucherCodeService.markAsUsed(voucher.code);
    return { discount };
  }

  @MessagePattern('get_vouchers_by_customer')
  findAllByCustomerEmail(@Param('customerEmail') customerEmail: string): Promise<VoucherCode[]> {
    return this.voucherCodeService.findAllByCustomerEmail(customerEmail);
  }
}
