import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston-logger';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { SpecialOffer, SpecialOfferSchema } from './schemas/special-offer.schema';
import { SpecialOfferRepository } from './repositories/special-offer.repository';
import { SpecialOfferService } from './app.service';
import { SpecialOfferController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot(winstonConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: SpecialOffer.name, schema: SpecialOfferSchema }])
  ],
  controllers: [SpecialOfferController],
  providers: [
    SpecialOfferService,
    SpecialOfferRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ]
})
export class AppModule {}
