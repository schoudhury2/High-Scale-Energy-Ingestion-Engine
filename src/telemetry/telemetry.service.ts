
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeterHistory } from '../entities/meter-history.entity';
import { VehicleHistory } from '../entities/vehicle-history.entity';
import { MeterCurrent } from '../entities/meter-current.entity';
import { VehicleCurrent } from '../entities/vehicle-current.entity';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectRepository(MeterHistory) private meterHistRepo: Repository<MeterHistory>,
    @InjectRepository(VehicleHistory) private vehicleHistRepo: Repository<VehicleHistory>,
    @InjectRepository(MeterCurrent) private meterCurrRepo: Repository<MeterCurrent>,
    @InjectRepository(VehicleCurrent) private vehicleCurrRepo: Repository<VehicleCurrent>,
  ) {}

  async handleMeter(dto: any) {
    const ts = new Date(dto.timestamp);
    await this.meterHistRepo.insert({ ...dto, timestamp: ts });

    await this.meterCurrRepo.upsert({
      meterId: dto.meterId,
      kwhConsumedAc: dto.kwhConsumedAc,
      voltage: dto.voltage,
      lastSeen: ts,
    }, ['meterId']);

    return { status: 'meter ingested' };
  }

  async handleVehicle(dto: any) {
    const ts = new Date(dto.timestamp);
    await this.vehicleHistRepo.insert({ ...dto, timestamp: ts });

    await this.vehicleCurrRepo.upsert({
      vehicleId: dto.vehicleId,
      soc: dto.soc,
      kwhDeliveredDc: dto.kwhDeliveredDc,
      batteryTemp: dto.batteryTemp,
      lastSeen: ts,
    }, ['vehicleId']);

    return { status: 'vehicle ingested' };
  }
}
