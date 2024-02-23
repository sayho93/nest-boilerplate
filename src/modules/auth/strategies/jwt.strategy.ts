import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigsService } from '../../configs/configs.service';
import { LoggerService } from '../../logger/logger.service';
import { JwtPayload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configsService: ConfigsService,
    private readonly loggerService: LoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configsService.App.jwtSecret,
      algorithms: configsService.App.jwtAlgorithm,
    });
  }

  async validate(jwtPayload: JwtPayload) {
    return jwtPayload;
  }
}
