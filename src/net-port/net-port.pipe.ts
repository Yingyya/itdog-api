import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class NetPortPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    const port = Number(value);
    if (port > 0 && port <= 65535) {
      return value;
    }
    throw new BadRequestException('无效的端口号！');
  }
}
