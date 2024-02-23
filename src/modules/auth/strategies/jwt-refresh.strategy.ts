import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigsService } from '../../configs/configs.service';
import { LoggerService } from '../../logger/logger.service';
import { JwtPayload } from '../auth.interface';
import { AuthService } from '../auth.service';
import { extractTokenFromAuthBearer, isSameHash } from '../auth.util';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configsService: ConfigsService,
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configsService.App.jwtRefreshSecret,
      algorithms: configsService.App.jwtAlgorithm,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, jwtPayload: JwtPayload) {
    const refreshToken = extractTokenFromAuthBearer(request);
    if (!refreshToken) throw new UnauthorizedException();

    const tokenFromStore = await this.authService.getTokenFromCacheOrThrow(jwtPayload.userId);

    const isSame = await isSameHash(refreshToken, tokenFromStore);
    if (!isSame) throw new UnauthorizedException('token does not match');

    const auth = await this.authService.findOneById(jwtPayload.authId);
    if (!auth) throw new UnauthorizedException('auth not found');

    request.auth = auth;

    await this.authService.deleteTokenFromCache(jwtPayload.userId);

    return jwtPayload;
  }
}
