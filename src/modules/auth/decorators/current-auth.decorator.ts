import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Auth } from '../auth.entity';
import { JwtPayload } from '../auth.interface';

export const getCurrentUserByContext = (context: ExecutionContext): JwtPayload | undefined => {
  switch (context.getType()) {
    case 'http':
      return context.switchToHttp().getRequest<Request>().user;
    case 'rpc':
      return context.switchToRpc().getData().user;
    case 'ws':
      return context.switchToWs().getData().user;
  }
};

export const getCurrentAuthByContext = (context: ExecutionContext): Auth | undefined => {
  switch (context.getType()) {
    case 'http':
      return context.switchToHttp().getRequest<Request>().auth;
    case 'rpc':
      return context.switchToRpc().getData().user;
    case 'ws':
      return context.switchToWs().getData().user;
  }
};

export const CurrentAuth = createParamDecorator((_data: unknown, context: ExecutionContext) =>
  getCurrentAuthByContext(context),
);

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) =>
  getCurrentUserByContext(context),
);
