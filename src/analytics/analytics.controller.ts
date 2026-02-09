
import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('/v1/analytics')
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('performance/:vehicleId')
  getPerformance(@Param('vehicleId') id: string) {
    return this.service.getPerformance(id);
  }
}
