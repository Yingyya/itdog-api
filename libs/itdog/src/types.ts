export interface OPing {
  ip: string;
  result: string;
  name: string;
  address: string;
  province: number;
  line: number;
  region: number;
}

export interface PingResponse {
  ip?: string;
  delay?: string;
  address?: string;
  node?: string;
}

export interface RegionTotal {
  nodes: number;
  all: number;
  fast: {
    name: string;
    delay: number;
  };
  slow: {
    name: string;
    delay: number;
  };
}

export interface OTcping {
  ip: string;
  result: string;
  name: string;
  address: string;
  province: number;
  line: number;
  region: number;
}

export interface TCPingResponse {
  ip?: string;
  delay?: string;
  address?: string;
  node?: string;
  port?: number;
}

export interface OHttp {
  type: string;
  ip: string;
  http_code: number;
  all_time: string;
  dns_time: string;
  connect_time: string;
  ssl_time: string;
  redirect: number;
  redirect_time: string;
  head: string;
  name: string;
  address: string;
  province: number;
  line: number;
  region: number;
}

export interface HttpResponse {
  ip: string;
  http_code: number;
  all_time: string;
  dns_time: string;
  connect_time: string;
  ssl_time: string;
  redirect: number;
  redirect_time: string;
  name: string;
  address: string;
}

export type DNS_TYPE =
  | 'a'
  | 'cname'
  | 'mx'
  | 'aaaa'
  | 'ns'
  | 'txt'
  | 'ptr'
  | 'srv';

/*
{
  type: 'success',
  host: 'hk.server.yingyya.cn',
  result: [ '107.151.246.113' ],
  time: '54',
  node_id: 1192,
  line: 5,
  name: '马来西亚',
  region: 9,
  province: 99
}

 */

export interface ODNS {
  type: string;
  host: string;
  result: string[];
  time: string;
  line: number;
  name: string;
  region: number;
  province: number;
}

export interface DNSResponse {
  node: string;
  delay: string;
  result: string[];
}
