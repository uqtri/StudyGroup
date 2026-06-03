import { jest } from '@jest/globals';

const modelCache = {};

const dollarMethods = {
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  $transaction: jest.fn((cb) => Promise.resolve(cb(new PrismaClient()))),
};

const createModelDelegate = () => ({
  count: jest.fn().mockResolvedValue(0),
  findMany: jest.fn().mockResolvedValue([]),
  findFirst: jest.fn().mockResolvedValue(null),
  findUnique: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(null),
  update: jest.fn().mockResolvedValue(null),
  delete: jest.fn().mockResolvedValue(null),
  upsert: jest.fn().mockResolvedValue(null),
  groupBy: jest.fn().mockResolvedValue([]),
  aggregate: jest.fn().mockResolvedValue({}),
});

export class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(_target, prop) {
        if (prop.startsWith('$')) {
          if (!dollarMethods[prop]) {
            dollarMethods[prop] = jest.fn().mockResolvedValue(undefined);
          }
          return dollarMethods[prop];
        }
        if (!modelCache[prop]) {
          modelCache[prop] = createModelDelegate();
        }
        return modelCache[prop];
      },
    });
  }
}
