
import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Controller('/v1/telemetry')
export class TelemetryController {
  constructor(private service: TelemetryService) {}

  @Post('ingest')
  async ingest(@Body() body: any) {
    if (body.meterId) return this.service.handleMeter(body);
    if (body.vehicleId) return this.service.handleVehicle(body);
    throw new BadRequestException('Unknown telemetry type');
  }
}
