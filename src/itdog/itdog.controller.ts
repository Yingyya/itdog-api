import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { NetAddressPipe } from '../net-address/net-address.pipe';
import { ItdogService } from 'api/itdog';
import { NetPortPipe } from '../net-port/net-port.pipe';
import { HttpOptionsDto } from './http-options.dto';
import { DNS_TYPE } from 'api/itdog/types';

@Controller('/it')
export class ItdogController {
  constructor(private readonly itdogService: ItdogService) {}

  @Get('ping')
  async ping(@Query('host', NetAddressPipe) host: string) {
    return this.itdogService.ping(host);
  }

  @Get('tcping')
  async tcping(
    @Query('host', NetAddressPipe) host: string,
    @Query('port', NetPortPipe) port: number,
  ) {
    return this.itdogService.tcping(host, port);
  }

  @Post('http')
  async http(@Body() httpOptions: HttpOptionsDto) {
    try {
      new URL(httpOptions.url);
    } catch {
      throw new BadRequestException('无效的请求链接！');
    }
    if (!['get', 'post'].includes(httpOptions.method.toLowerCase())) {
      throw new BadRequestException('无效的请求方式！');
    }
    return this.itdogService.http(httpOptions);
  }

  @Get('dns')
  async dns(
    @Query('domain', NetAddressPipe) domain: string,
    @Query('type') type: string,
    @Query('server') server: string = '223.5.5.5',
  ) {
    if (
      !['a', 'cname', 'mx', 'aaaa', 'ns', 'txt', 'ptr', 'srv'].includes(
        type.toLowerCase(),
      )
    ) {
      throw new BadRequestException('无效的解析类型！');
    }
    return this.itdogService.dns(domain, <DNS_TYPE>type, server);
  }
}
