import { Controller, Get } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { HealthCheck, HealthCheckService, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { BypassAuth } from './auth/decorators/auth.decorator';
import { ConfigsService } from './configs/configs.service';
import { LoggerService } from './logger/logger.service';

@Controller('/')
@BypassAuth()
export class AppController {
  public constructor(
    private readonly configsService: ConfigsService,
    private readonly healthCheckService: HealthCheckService,
    private readonly microserviceHealthIndicator: MicroserviceHealthIndicator,
    private readonly loggerService: LoggerService,
  ) {}

  private readonly redisCheck = () => {
    const redisConfig = this.configsService.Redis;

    return this.microserviceHealthIndicator.pingCheck('redis', {
      transport: Transport.REDIS,
      options: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
    });
  };

  @Get('/')
  public home() {
    const app = this.configsService.App;
    return {
      env: app.env,
      serviceName: app.serviceName,
    };
  }

  @Get('/health')
  @HealthCheck()
  public async health() {
    return this.healthCheckService.check([this.redisCheck]);
  }
}
