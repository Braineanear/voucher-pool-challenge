import { Controller } from '@nestjs/common';
import { SpecialOfferService } from './app.service';
import { CreateSpecialOfferDto } from './dtos/create-special-offer.dto';
import { UpdateSpecialOfferDto } from './dtos/update-special-offer.dto';
import { SpecialOffer } from './schemas/special-offer.schema';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('special-offers')
export class SpecialOfferController {
  constructor(private readonly specialOfferService: SpecialOfferService) {}

  @MessagePattern({ cmd: 'create_special_offer' })
  create(@Payload() createSpecialOfferDto: CreateSpecialOfferDto): Promise<SpecialOffer> {
    console.log(createSpecialOfferDto)
    return this.specialOfferService.create(createSpecialOfferDto);
  }

  @MessagePattern({ cmd: 'get_special_offers' })
  findAll(): Promise<SpecialOffer[]> {
    return this.specialOfferService.findAll();
  }

  @MessagePattern({ cmd: 'get_special_offer' })
  findOne(@Payload('name') name: string): Promise<SpecialOffer> {
    return this.specialOfferService.findOne(name);
  }

  @MessagePattern({ cmd: 'update_special_offer' })
  update(
    @Payload('name') name: string,
    @Payload() updateSpecialOfferDto: UpdateSpecialOfferDto,
  ): Promise<SpecialOffer> {
    return this.specialOfferService.update(name, updateSpecialOfferDto);
  }

  @MessagePattern({ cmd: 'delete_special_offer' })
  remove(@Payload('name') name: string): Promise<void> {
    return this.specialOfferService.remove(name);
  }
}
