import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../../modules/auth/auth.interface';

export const getCurrentAuthByContext = (context: ExecutionContext): JwtPayload | undefined => {
  switch (context.getType()) {
    case 'http':
      return context.switchToHttp().getRequest<Request>().user;
    case 'rpc':
      return context.switchToRpc().getData().user;
    case 'ws':
      return context.switchToWs().getData().user;
  }
};

export const CurrentAuth = createParamDecorator((_data: unknown, context: ExecutionContext) =>
  getCurrentAuthByContext(context),
);
