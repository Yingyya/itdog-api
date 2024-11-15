import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception?.message || 'Internal server error';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    response.status(200).json({
      code: status,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
