import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport, TcpOptions, MicroserviceOptions } from '@nestjs/microservices';
import { SpecialOfferModule } from './special-offer/special-offer.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(SpecialOfferModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: new ConfigService().get('port'),
    },
  } as TcpOptions);

  await app.listen();
}

bootstrap();
