import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { winstonConfig } from './logger/winston-logger';
import { CustomerController } from './customer.controller';
import { SpecialOfferController } from './special-offer.controller';
import { VoucherCodeController } from './voucher-code.controller';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    CustomerController,
    SpecialOfferController,
    VoucherCodeController,
  ],
  providers: [
    ConfigService,
    {
      provide: 'CUSTOMER_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: configService.get<number>('CUSTOMER_SERVICE_PORT'),
            host: configService.get<string>('CUSTOMER_SERVICE_HOST'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'OFFER_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: configService.get<number>('OFFER_SERVICE_PORT'),
            host: configService.get<string>('OFFER_SERVICE_HOST'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'VOUCHER_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: configService.get<number>('VOUCHER_SERVICE_PORT'),
            host: configService.get<string>('VOUCHER_SERVICE_HOST'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
