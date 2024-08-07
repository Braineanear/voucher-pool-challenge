import { Controller } from '@nestjs/common';
import { VoucherCodeService } from './app.service';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { ValidateVoucherDto } from './dtos/validate-voucher.dto';
import { VoucherCode } from './schemas/voucher-code.schema';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('voucher-codes')
export class VoucherCodeController {
  constructor(private readonly voucherCodeService: VoucherCodeService) {}

  @MessagePattern('create_voucher_code')
  create(@Payload() createVoucherDto: CreateVoucherDto): Promise<VoucherCode> {
    return this.voucherCodeService.create(createVoucherDto);
  }

  @MessagePattern('validate_voucher_code')
  async validate(@Payload() validateVoucherDto: ValidateVoucherDto): Promise<{ discount: number }> {
    const { voucher, discount } = await this.voucherCodeService.validateAndFetchDiscount(validateVoucherDto);
    await this.voucherCodeService.markAsUsed(voucher.code);
    return { discount };
  }

  @MessagePattern('get_vouchers_by_customer')
  findAllByCustomerEmail(@Payload('customerEmail') customerEmail: string): Promise<VoucherCode[]> {
    return this.voucherCodeService.findAllByCustomerEmail(customerEmail);
  }
}
