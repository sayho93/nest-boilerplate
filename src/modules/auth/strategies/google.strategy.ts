import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigsService } from '../../configs/configs.service';
import { LoggerService } from '../../logger/logger.service';
import { AuthType } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configsService: ConfigsService,
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {
    super({ ...configsService.OAuth.google, passReqToCallback: true });
  }

  public authenticate(req: Request, options?: any) {
    return super.authenticate(req, options);
  }

  public async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    this.loggerService.debug(this.validate.name, { accessToken, refreshToken });
    this.loggerService.debug(this.validate.name, profile);

    const { name, emails, photos } = profile;

    if (!emails || !name) return done(new UnauthorizedException('invalid data from provider'));

    try {
      const auth = await this.authService.validate({
        type: AuthType.GOOGLE,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        accessToken,
        refreshToken,
      });

      req.auth = auth;

      return done(null, auth);
    } catch (err) {
      return done(new UnauthorizedException(err));
    }
  }
}
