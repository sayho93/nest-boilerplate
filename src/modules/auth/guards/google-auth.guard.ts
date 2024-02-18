import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public async canActivate(context: ExecutionContext) {
    // const bypassAuth =
    //   this.reflector.get<boolean | undefined>(BYPASS_AUTH, context.getClass()) ||
    //   this.reflector.get<boolean | undefined>(BYPASS_AUTH, context.getHandler());
    // if (bypassAuth) return true;

    return super.canActivate(context) as boolean;
  }
}
