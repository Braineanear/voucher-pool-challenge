import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject('winston') private readonly logger: Logger
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const data = context.switchToRpc().getData();
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() => {
          const delay = Date.now() - now;
          this.logger.info(
            `TCP Request - Data: ${JSON.stringify(data)} - ${delay}ms`
          );
        }),
        catchError((error) => {
          const status =
            error instanceof RpcException
              ? HttpStatus.INTERNAL_SERVER_ERROR
              : HttpStatus.INTERNAL_SERVER_ERROR;
          const delay = Date.now() - now;

          this.logger.error(
            `TCP Request - Data: ${JSON.stringify(data)} - ${status} - ${delay}ms - Error: ${error.message}`,
            { stack: error.stack }
          );

          return throwError(() => new RpcException(error.message));
        })
      );
  }
}
