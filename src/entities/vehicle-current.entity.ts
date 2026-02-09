
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('vehicle_current')
export class VehicleCurrent {
  @PrimaryColumn()
  vehicleId: string;

  @Column('float')
  soc: number;

  @Column('float')
  kwhDeliveredDc: number;

  @Column('float')
  batteryTemp: number;

  @Column()
  lastSeen: Date;
}
