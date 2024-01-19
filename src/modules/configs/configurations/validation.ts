import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function validateConfig<T>(
  instanceType: ClassConstructor<T>,
  configObject: object,
): T {
  const configInstance = plainToInstance(instanceType, configObject, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(configInstance as object, {
    skipMissingProperties: false,
  });
  if (errors.length) {
    throw new Error(errors.toString());
  }

  return configInstance;
}
