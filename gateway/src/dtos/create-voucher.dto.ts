import { IsEmail, IsNotEmpty, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoucherDto {
  @ApiProperty({ description: 'Email of the customer', example: 'customer@example.com' })
  @IsNotEmpty()
  @IsEmail()
  readonly customerEmail: string;

  @ApiProperty({ description: 'Name of the special offer', example: 'Black Friday Sale' })
  @IsNotEmpty()
  @IsString()
  readonly specialOfferName: string;

  @ApiProperty({ description: 'Expiration date of the voucher', example: '2024-12-31' })
  @IsNotEmpty()
  @IsString()
  readonly expirationDate: string;
}
