import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as net from 'net';
import * as dns from 'dns/promises';

@Injectable()
export class NetAddressPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined) {
      throw new BadRequestException('不正确的主机名或IPV4地址！');
    }
    if (net.isIPv4(value)) {
      return value;
    }
    try {
      const result = await dns.resolve(value);
      if (result.length) {
        return value;
      }
    } catch {
      throw new BadRequestException('不正确的主机名或IPV4地址！');
    }
    throw new BadRequestException('不正确的主机名或IPV4地址！');
  }
}
