import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialOfferService } from '../special-offer.service';
import { SpecialOfferController } from './special-offer.controller';
import { SpecialOffer, SpecialOfferSchema } from './schemas/special-offer.schema';
import { SpecialOfferRepository } from './repositories/special-offer.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SpecialOffer.name, schema: SpecialOfferSchema }]),
  ],
  controllers: [SpecialOfferController],
  providers: [SpecialOfferService, SpecialOfferRepository],
  exports: [SpecialOfferService, SpecialOfferRepository]
})
export class SpecialOfferModule {}
