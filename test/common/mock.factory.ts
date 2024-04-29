import { MockFactory } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

export const mockFactory =
  (moduleMocker: ModuleMocker): MockFactory =>
  (token) => {
    if (typeof token === 'function') {
      const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
      const Mock = moduleMocker.generateFromMetadata(mockMetadata);

      return new Mock();
    }
  };
