import { Request as ExpressRequest } from 'express';
import { JwtPayload } from '../../modules/auth/auth.interface';

interface CookieStore {
  Authentication?: { accessToken: string };
}

declare module 'express' {
  interface Request {
    startTime: number;
    requestId: string;
    user?: JwtPayload; // current auth payload
    cookies?: CookieStore;
  }
}

export type Request = ExpressRequest;
