import { Request as ExpressRequest } from 'express';
import { JwtPayload } from '../../modules/auth/auth.interface';
import { Auth } from '../../modules/auth/entities/auth.entity';

interface CookieStore {
  // Authentication?: { accessToken: string };
}

declare module 'express' {
  interface Request {
    startTime: number;
    requestId: string;
    auth?: Auth; // current auth payload
    user?: JwtPayload;
  }
}

export type Request = ExpressRequest;
