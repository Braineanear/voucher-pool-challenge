import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport, TcpOptions } from '@nestjs/microservices';
import { VoucherCodeModule } from 'src/voucher-code/voucher-code.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(VoucherCodeModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: new ConfigService().get('port'),
    },
  } as TcpOptions);

  await app.listen();
}
bootstrap();
