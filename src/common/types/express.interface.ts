import { Request as ExpressRequest } from 'express';
import { Auth } from '../../modules/auth/auth.entity';
import { JwtPayload } from '../../modules/auth/auth.interface';

interface CookieStore {
  Authentication?: { accessToken: string };
}

declare module 'express' {
  interface Request {
    startTime: number;
    requestId: string;
    auth?: Auth; // current auth payload
    user?: JwtPayload;
    cookies?: CookieStore;
  }
}

export type Request = ExpressRequest;
