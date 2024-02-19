import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { LoggerService } from '../../logger/logger.service';
import { Auth } from '../auth.entity';
import { AuthType } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {
    super({ usernameField: 'email', passwordField: 'password', passReqToCallback: true });
  }

  public async validate(req: Request, email: string, password: string): Promise<Auth> {
    this.loggerService.debug(this.validate.name, { email, password });

    const auth = await this.authService.validate({ type: AuthType.EMAIL, email, password });
    if (!auth) throw new UnauthorizedException();

    req.auth = auth;

    return auth;
  }
}
