import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSpecialOfferDto {
  @ApiProperty({ description: 'Name of the special offer', example: 'Summer Sale', required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ description: 'Discount percentage', example: 20, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  readonly discountPercentage?: number;
}
