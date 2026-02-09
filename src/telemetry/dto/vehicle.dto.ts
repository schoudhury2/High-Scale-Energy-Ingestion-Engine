
import { IsNumber, IsString } from 'class-validator';

export class VehicleDto {
  @IsString()
  vehicleId: string;

  @IsNumber()
  soc: number;

  @IsNumber()
  kwhDeliveredDc: number;

  @IsNumber()
  batteryTemp: number;

  @IsString()
  timestamp: string;
}
