import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport, TcpOptions, MicroserviceOptions } from '@nestjs/microservices';
import { CustomerModule } from './customer/customer.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(CustomerModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: new ConfigService().get('port'),
    },
  } as TcpOptions);

  await app.listen();
}
bootstrap();
