import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SpecialOfferDocument = SpecialOffer & Document;

@Schema()
export class SpecialOffer {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  discountPercentage: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const SpecialOfferSchema = SchemaFactory.createForClass(SpecialOffer);
