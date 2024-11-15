import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('RequestLogger');
  use(req: any, res: any, next: () => void) {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    // 记录请求日志
    this.logger.log(`[${method}] ${originalUrl} - ${userAgent}`);
    next();
  }
}
