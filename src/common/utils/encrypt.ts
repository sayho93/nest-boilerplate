import { compare, hash } from 'bcrypt';

export const createHash = async (value: string): Promise<string> => {
  const saltOrRounds = 10;
  return await hash(value, saltOrRounds);
};

export const isSameAsHash = async (value: string, hashedvalue: string): Promise<boolean> => {
  return await compare(value, hashedvalue);
};
