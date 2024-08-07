import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston-logger';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { VoucherCodeService } from './app.service';
import { VoucherCode, VoucherCodeSchema } from './schemas/voucher-code.schema';
import { VoucherCodeRepository } from './repositories/voucher-code.repository';
import { VoucherCodeController } from './app.controller';

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
    MongooseModule.forFeature([{ name: VoucherCode.name, schema: VoucherCodeSchema }]),
  ],
  controllers: [VoucherCodeController],
  providers: [
    VoucherCodeService,
    VoucherCodeRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
