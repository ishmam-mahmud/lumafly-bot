import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/src/singleton.ts'],
};

export default config;
