import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSpecialOfferDto } from './dtos/create-special-offer.dto';
import { UpdateSpecialOfferDto } from './dtos/update-special-offer.dto';

@ApiTags('special-offers')
@Controller('special-offers')
export class SpecialOfferController {
  constructor(@Inject('OFFER_SERVICE') private readonly offerServiceClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Create a new special offer' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The special offer has been successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data.' })
  async create(@Body() createSpecialOfferDto: CreateSpecialOfferDto) {
    try{
      console.log('Received DTO:', createSpecialOfferDto);

      const response = await firstValueFrom(
        this.offerServiceClient.send('create_special_offer', createSpecialOfferDto),
      );

      console.log('After response:', response);

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all special offers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved all special offers.' })
  async findAll() {
    console.log('Fetching all special offers');

    const response = await firstValueFrom(
      this.offerServiceClient.send('get_special_offers', {})
    );

    console.log('All special offers:', response);

    return response;
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get a special offer by name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieved the special offer.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Special offer not found.' })
  async findOne(@Param('name') name: string) {
    console.log('Fetching special offer with name:', name);

    const response = await firstValueFrom(
      this.offerServiceClient.send('get_special_offer', { name })
    );

    console.log('Special offer:', response);

    return response;
  }

  @Put(':name')
  @ApiOperation({ summary: 'Update a special offer by name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The special offer has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Special offer not found.' })
  async update(
    @Param('name') name: string,
    @Body() updateSpecialOfferDto: UpdateSpecialOfferDto,
  ) {
    console.log('Updating special offer with name:', name, 'DTO:', updateSpecialOfferDto);

    const response = await firstValueFrom(
      this.offerServiceClient.send('update_special_offer', { name, payload: updateSpecialOfferDto })
    );

    console.log('Updated special offer:', response);

    return response;
  }

  @Delete(':name')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a special offer by name' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The special offer has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Special offer not found.' })
  async remove(@Param('name') name: string): Promise<void> {
    console.log('Deleting special offer with name:', name);

    await firstValueFrom(
      this.offerServiceClient.send('delete_special_offer', { name })
    );

    console.log('Deleted special offer with name:', name);
  }
}
