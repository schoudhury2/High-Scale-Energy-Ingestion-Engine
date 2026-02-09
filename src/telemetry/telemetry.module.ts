
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
import { MeterHistory } from '../entities/meter-history.entity';
import { VehicleHistory } from '../entities/vehicle-history.entity';
import { MeterCurrent } from '../entities/meter-current.entity';
import { VehicleCurrent } from '../entities/vehicle-current.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeterHistory, VehicleHistory, MeterCurrent, VehicleCurrent])],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}
