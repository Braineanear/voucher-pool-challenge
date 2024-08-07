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

@Controller('special-offers')
@ApiTags('special-offers')
export class SpecialOfferController {
  constructor(
    @Inject('SPECIAL_OFFER_SERVICE')
    private readonly specialOfferServiceClient: ClientProxy,
  ) {}

}
