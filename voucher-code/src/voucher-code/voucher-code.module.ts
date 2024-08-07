import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VoucherCodeService } from './voucher-code.service';
import { VoucherCodeController } from './voucher-code.controller';
import { VoucherCode, VoucherCodeSchema } from './schemas/voucher-code.schema';
import { VoucherCodeRepository } from './repositories/voucher-code.repository';
import { SpecialOfferModule } from '@modules/special-offer/special-offer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: VoucherCode.name, schema: VoucherCodeSchema }]),
    forwardRef(() => SpecialOfferModule)
  ],
  controllers: [VoucherCodeController],
  providers: [VoucherCodeService, VoucherCodeRepository],
})
export class VoucherCodeModule {}
