import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthType, JwtPayload } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  public async validate(email: string, password: string): Promise<JwtPayload> {
    const auth = await this.authService.validateEmail({ type: AuthType.EMAIL, email, password });
    if (!auth) throw new UnauthorizedException();

    return {
      authId: auth.id,
      userId: auth.user.id,
      firstName: auth.user.firstName,
      lastName: auth.user.lastName,
      role: auth.user.role,
    };
  }
}
