import { compare, hash } from 'bcrypt';

export const createHash = async (plain: string): Promise<string> => {
  const saltOrRounds = 12;
  return await hash(plain, saltOrRounds);
};

export const isSameHash = async (plain: string, hashed: string): Promise<boolean> => {
  return await compare(plain, hashed);
};
