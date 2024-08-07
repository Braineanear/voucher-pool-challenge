import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VoucherCodeDocument = VoucherCode & Document;

@Schema()
export class VoucherCode {
  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({ type: String, required: true })
  customerEmail: string;

  @Prop({ type: String, required: true })
  specialOfferName: string;

  @Prop({ type: String, required: true })
  expirationDate: string;

  @Prop({ type: Date, default: null })
  usedAt: Date | null;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const VoucherCodeSchema = SchemaFactory.createForClass(VoucherCode);
