import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { BYPASS_AUTH } from '../../../common/constants/auth.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const bypassAuth =
      this.reflector.get<boolean | undefined>(BYPASS_AUTH, context.getClass()) ||
      this.reflector.get<boolean | undefined>(BYPASS_AUTH, context.getHandler());
    if (bypassAuth) return true;

    return super.canActivate(context) as Promise<boolean>;
  }
}
