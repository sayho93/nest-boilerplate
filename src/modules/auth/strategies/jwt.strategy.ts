import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { ConfigsService } from '../../configs/configs.service';
import { LoggerService } from '../../logger/logger.service';
import { JwtPayload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configsService: ConfigsService,
    private readonly loggerService: LoggerService,
  ) {
    const fromAuthCookie = () => (request: Request) => {
      let token = null;
      if (request && request.cookies?.Authentication) token = request.cookies.Authentication.accessToken;
      this.loggerService.info(this.validate.name, { token });

      return token;
    };

    const fromAuthHeader = () => (request: Request) => {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      this.loggerService.info(this.validate.name, { token });
      return type === 'Bearer' ? token : undefined;
    };

    super({
      jwtFromRequest: fromAuthHeader(),
      ignoreExpiration: false,
      secretOrKey: configsService.App.jwtSecret,
      algorithms: configsService.App.jwtAlgorithm,
    });
  }

  async validate(jwtPayload: JwtPayload) {
    return jwtPayload;
  }
}
