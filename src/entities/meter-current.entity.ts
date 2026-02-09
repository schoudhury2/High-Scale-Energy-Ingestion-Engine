
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('meter_current')
export class MeterCurrent {
  @PrimaryColumn()
  meterId: string;

  @Column('float')
  kwhConsumedAc: number;

  @Column('float')
  voltage: number;

  @Column()
  lastSeen: Date;
}
