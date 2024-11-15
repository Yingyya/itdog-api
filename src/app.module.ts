import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItdogModule } from './itdog/itdog.module';
import { GlobalExceptionFilter } from './global-exception/global-exception.filter';
import { ResponseInterceptorInterceptor } from './response-interceptor/response-interceptor.interceptor';
import { RequestLoggerMiddleware } from './request-logger/request-logger.middleware';

@Module({
  imports: [ItdogModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: GlobalExceptionFilter,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptorInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
