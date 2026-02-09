
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryModule } from './telemetry/telemetry.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MeterHistory } from './entities/meter-history.entity';
import { VehicleHistory } from './entities/vehicle-history.entity';
import { MeterCurrent } from './entities/meter-current.entity';
import { VehicleCurrent } from './entities/vehicle-current.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'energy',
      entities: [MeterHistory, VehicleHistory, MeterCurrent, VehicleCurrent],
      synchronize: true,
    }),
    TelemetryModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
