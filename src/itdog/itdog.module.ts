import { Module } from '@nestjs/common';
import { ItdogController } from './itdog.controller';
import { ItdogModule as LibItdogModule } from 'libs/itdog/src/itdog.module';

@Module({
  controllers: [ItdogController],
  imports: [ItdogModule, LibItdogModule],
})
export class ItdogModule {}
