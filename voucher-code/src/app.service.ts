import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { VoucherCodeRepository } from './repositories/voucher-code.repository';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { ValidateVoucherDto } from './dtos/validate-voucher.dto';
import { VoucherCode } from './schemas/voucher-code.schema';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VoucherCodeService {
  private client: ClientProxy;

  constructor(
    private readonly voucherCodeRepository: VoucherCodeRepository,
    private readonly configService: ConfigService
  ) {}

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        port: this.configService.get<number>('OFFER_SERVICE_PORT'),
        host: this.configService.get<string>('OFFER_SERVICE_HOST'),
      }
    });
  }

  private generateUniqueCode(): string {
    return crypto.randomBytes(4).toString('hex');
  }

  async create(createVoucherDto: CreateVoucherDto): Promise<VoucherCode> {
    const code = this.generateUniqueCode();
    return this.voucherCodeRepository.create(createVoucherDto, code);
  }

  async validateAndFetchDiscount(validateVoucherDto: ValidateVoucherDto): Promise<{ voucher: VoucherCode, discount: number }> {
    const voucher = await this.voucherCodeRepository.findByCode(validateVoucherDto.code);
    console.log('voucher', voucher);
    if (!voucher || voucher.customerEmail !== validateVoucherDto.customerEmail) {
      throw new NotFoundException('Voucher not found or does not belong to this customer.');
    }
    if (voucher.usedAt) {
      throw new BadRequestException('Voucher has already been used.');
    }
    if (new Date(voucher.expirationDate) < new Date()) {
      throw new BadRequestException('Voucher has expired.');
    }

    console.log('passed checks');

    const specialOffer = await firstValueFrom(this.client.send('get_special_offer', { name: voucher.specialOfferName }));

    console.log(specialOffer);

    if (!specialOffer) {
      throw new NotFoundException('Special offer not found.');
    }

    return { voucher, discount: specialOffer.discountPercentage };
  }

  async markAsUsed(code: string): Promise<VoucherCode> {
    const voucher = await this.voucherCodeRepository.markAsUsed(code);
    if (!voucher) {
      throw new NotFoundException('Voucher not found.');
    }
    return voucher;
  }

  async findAllByCustomerEmail(customerEmail: string): Promise<VoucherCode[]> {
    return this.voucherCodeRepository.findAllByCustomerEmail(customerEmail);
  }
}
