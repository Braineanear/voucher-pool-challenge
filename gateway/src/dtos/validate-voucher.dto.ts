import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateVoucherDto {
  @ApiProperty({ description: 'Email of the customer', example: 'customer@example.com' })
  @IsNotEmpty()
  @IsEmail()
  readonly customerEmail: string;

  @ApiProperty({ description: 'Voucher code', example: 'abc123def' })
  @IsNotEmpty()
  @IsString()
  readonly code: string;
}
