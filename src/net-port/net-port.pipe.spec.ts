import { NetPortPipe } from './net-port.pipe';

describe('NetPortPipe', () => {
  it('should be defined', () => {
    expect(new NetPortPipe().transform(33, null)).toBe(33);
  });
});
