
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleHistory } from '../entities/vehicle-history.entity';
import { MeterHistory } from '../entities/meter-history.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VehicleHistory) private vehicleRepo: Repository<VehicleHistory>,
    @InjectRepository(MeterHistory) private meterRepo: Repository<MeterHistory>,
  ) {}

  async getPerformance(vehicleId: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const v = await this.vehicleRepo
      .createQueryBuilder('v')
      .select('SUM(v.kwhDeliveredDc)', 'dc')
      .addSelect('AVG(v.batteryTemp)', 'temp')
      .where('v.vehicleId = :id', { id: vehicleId })
      .andWhere('v.timestamp >= :since', { since })
      .getRawOne();

    const m = await this.meterRepo
      .createQueryBuilder('m')
      .select('SUM(m.kwhConsumedAc)', 'ac')
      .where('m.meterId = :id', { id: vehicleId })
      .andWhere('m.timestamp >= :since', { since })
      .getRawOne();

    const ac = Number(m?.ac || 0);
    const dc = Number(v?.dc || 0);

    return {
      vehicleId,
      acConsumed: ac,
      dcDelivered: dc,
      efficiency: ac ? dc / ac : 0,
      avgBatteryTemp: Number(v?.temp || 0),
    };
  }
}
