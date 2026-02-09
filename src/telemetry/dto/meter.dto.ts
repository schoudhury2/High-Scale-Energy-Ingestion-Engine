
import { IsNumber, IsString } from 'class-validator';

export class MeterDto {
  @IsString()
  meterId: string;

  @IsNumber()
  kwhConsumedAc: number;

  @IsNumber()
  voltage: number;

  @IsString()
  timestamp: string;
}
