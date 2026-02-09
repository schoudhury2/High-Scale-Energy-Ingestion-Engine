
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MeterHistory } from '../entities/meter-history.entity';
import { VehicleHistory } from '../entities/vehicle-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeterHistory, VehicleHistory])],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
