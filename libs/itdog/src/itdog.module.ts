import { Module } from '@nestjs/common';
import { ItdogService } from './itdog.service';

@Module({
  providers: [ItdogService],
  exports: [ItdogService],
})
export class ItdogModule {}
