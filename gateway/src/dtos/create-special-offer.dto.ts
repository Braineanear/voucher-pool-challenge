import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecialOfferDto {
  @ApiProperty({ description: 'Name of the special offer', example: 'Summer Sale' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Discount percentage', example: 20 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  readonly discountPercentage: number;
}
