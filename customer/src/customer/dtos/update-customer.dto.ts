import { IsOptional, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiProperty({ description: 'Name of the customer', example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ description: 'Email of the customer', example: 'customer@example.com', required: false })
  @IsOptional()
  @IsEmail()
  readonly email?: string;
}
