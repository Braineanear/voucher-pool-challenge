import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpecialOffer, SpecialOfferDocument } from '../schemas/special-offer.schema';
import { CreateSpecialOfferDto } from '../dtos/create-special-offer.dto';
import { UpdateSpecialOfferDto } from '../dtos/update-special-offer.dto';

@Injectable()
export class SpecialOfferRepository {
  constructor(
    @InjectModel(SpecialOffer.name) private specialOfferModel: Model<SpecialOfferDocument>,
  ) {}

  async create(createSpecialOfferDto: CreateSpecialOfferDto): Promise<SpecialOffer> {
    const newSpecialOffer = new this.specialOfferModel(createSpecialOfferDto);
    return newSpecialOffer.save();
  }

  async findAll(): Promise<SpecialOffer[]> {
    return this.specialOfferModel.find().exec();
  }

  async findOne(name: string): Promise<SpecialOffer | null> {
    return this.specialOfferModel.findOne({ name }).exec();
  }

  async update(name: string, updateSpecialOfferDto: UpdateSpecialOfferDto): Promise<SpecialOffer | null> {
    return this.specialOfferModel
      .findOneAndUpdate({ name }, updateSpecialOfferDto, { new: true })
      .exec();
  }

  async remove(name: string): Promise<{ deletedCount?: number }> {
    return this.specialOfferModel.deleteOne({ name }).exec();
  }
}
