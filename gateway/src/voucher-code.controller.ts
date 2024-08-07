import {
  Controller,
  Inject,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('voucher-codes')
@ApiTags('voucher-codes')
export class VoucherCodeController {
  constructor(
    @Inject('VOUCHER_CODE_SERVICE')
    private readonly voucherCodeServiceClient: ClientProxy,
  ) {}

}
