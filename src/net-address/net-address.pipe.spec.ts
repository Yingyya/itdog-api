import * as net from 'net';
import { NetAddressPipe } from './net-address.pipe';

describe('NetAddressPipe', () => {
  it('should be defined', async () => {
    expect(net.isIPv4('127.0.0.1')).toBe(true);
    const pipe = new NetAddressPipe();
    expect(await pipe.transform('127.0.0.1', null)).toBe('127.0.0.1');
    expect(await pipe.transform('qq.com', null)).toBe('qq.com');
  });
});
