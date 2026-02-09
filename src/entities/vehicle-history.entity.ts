
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('vehicle_history')
@Index(['vehicleId', 'timestamp'])
export class VehicleHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicleId: string;

  @Column('float')
  soc: number;

  @Column('float')
  kwhDeliveredDc: number;

  @Column('float')
  batteryTemp: number;

  @Column()
  timestamp: Date;
}
