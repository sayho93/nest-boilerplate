import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './modules/app.module';
import { ConfigsService } from './modules/configs/configs.service';
import { LoggerService } from './modules/logger/logger.service';

class Main {
  public static async bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      bufferLogs: true,
    });
    const loggerService = await app.resolve(LoggerService);
    loggerService.setContext(Main.name);

    const configService = app.get(ConfigsService);
    const configs = configService.findAll();
    const appConfig = configService.App;
    loggerService.info(Main.bootstrap.name, configs, 'mapped env variables');

    app.set('trust proxy', true);
    app.use(helmet());
    app.enableCors();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    // app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    await app.listen(appConfig.port);

    return { appConfig, loggerService };
  }
}

Main.bootstrap().then(({ appConfig, loggerService }) => {
  loggerService.info(
    'app',
    `🚀 [${appConfig.serviceName}][${appConfig.env}] Server listening on port ${appConfig.port}`,
  );
});
