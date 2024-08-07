import { Injectable, NotFoundException } from '@nestjs/common';
import { SpecialOfferRepository } from './repositories/special-offer.repository';
import { CreateSpecialOfferDto } from './dtos/create-special-offer.dto';
import { UpdateSpecialOfferDto } from './dtos/update-special-offer.dto';
import { SpecialOffer } from './schemas/special-offer.schema';

@Injectable()
export class SpecialOfferService {
  constructor(private readonly specialOfferRepository: SpecialOfferRepository) {}

  async create(createSpecialOfferDto: CreateSpecialOfferDto): Promise<SpecialOffer> {
    return this.specialOfferRepository.create(createSpecialOfferDto);
  }

  async findAll(): Promise<SpecialOffer[]> {
    return this.specialOfferRepository.findAll();
  }

  async findOne(name: string): Promise<SpecialOffer> {
    const specialOffer = await this.specialOfferRepository.findOne(name);
    if (!specialOffer) {
      throw new NotFoundException(`Special offer with name ${name} not found`);
    }
    return specialOffer;
  }

  async update(name: string, updateSpecialOfferDto: UpdateSpecialOfferDto): Promise<SpecialOffer> {
    const updatedSpecialOffer = await this.specialOfferRepository.update(name, updateSpecialOfferDto);
    if (!updatedSpecialOffer) {
      throw new NotFoundException(`Special offer with name ${name} not found`);
    }
    return updatedSpecialOffer;
  }

  async remove(name: string): Promise<void> {
    const result = await this.specialOfferRepository.remove(name);
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Special offer with name ${name} not found`);
    }
  }
}
