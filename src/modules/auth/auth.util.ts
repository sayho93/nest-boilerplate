import { compare, hash } from 'bcrypt';
import { Request } from 'express';

export const createHash = async (plain: string): Promise<string> => {
  const saltOrRounds = 12;
  return await hash(plain, saltOrRounds);
};

export const isSameHash = async (plain: string, hashed: string): Promise<boolean> => {
  return await compare(plain, hashed);
};

export const extractTokenFromAuthBearer = (request: Request) => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
