import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/cjs/Mock';
import { Client as DiscordClient } from 'discord.js';
import prisma from './db/client';
import discordClient from './core/client';

jest.mock('./db/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

jest.mock('./core/client', () => ({
  __esModule: true,
  default: mockDeep<DiscordClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
  mockReset(discordClientMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
export const discordClientMock = discordClient as unknown as DeepMockProxy<DiscordClient>;
