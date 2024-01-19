import { Module } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import { LoggerService } from './logger.service';
import { Env } from '../configs/configs.interface';
import { ConfigsModule } from '../configs/configs.module';
import { ConfigsService } from '../configs/configs.service';

@Module({
  imports: [
    ConfigsModule,
    WinstonModule.forRootAsync({
      imports: [ConfigsModule],
      inject: [ConfigsService],
      useFactory: (configsService: ConfigsService) => {
        const { env, serviceName } = configsService.App;

        if (env === Env.Production) {
          return {
            transports: [new winston.transports.Console({ level: 'info' })],
          };
        }

        return {
          transports: [
            new winston.transports.Console({
              level: 'silly',
              format: winston.format.combine(
                winston.format.timestamp({
                  format: 'YYYY-MM-DD HH:mm:ss',
                }),
                utilities.format.nestLike(serviceName, {
                  prettyPrint: true,
                  colors: true,
                }),
              ),
            }),
          ],
        };
      },
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
