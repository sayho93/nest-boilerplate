import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { BYPASS_AUTH } from '../../../common/constants/auth.constant';
import { ConfigsService } from '../../configs/configs.service';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class AuthGuard extends PassportAuthGuard(['jwt', 'google']) {
  constructor(
    private readonly reflector: Reflector,
    private readonly configsService: ConfigsService,
    private readonly loggerService: LoggerService,
  ) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const bypassAuth =
      this.reflector.get<boolean | undefined>(BYPASS_AUTH, context.getClass()) ||
      this.reflector.get<boolean | undefined>(BYPASS_AUTH, context.getHandler());
    if (bypassAuth) return true;

    return (await super.canActivate(context)) as boolean;
  }

  // public handleRequest<JwtPayload>(err: any, user: JwtPayload, info: any, context: ExecutionContext, status?: any) {
  //   if (err || !user) throw err || new UnauthorizedException();
  //
  //   return user;
  // }
}
