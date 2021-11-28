import logError from './logError';
import { discordClientMock } from '../singleton';
import { Message, User } from 'discord.js';

describe('tests for logError', () => {
  it('test for logError', async () => {
    discordClientMock.users.fetch.mockResolvedValue({
      send: async (message: string) => {
        console.log(message);
        return {} as Message;
      },
    } as User);

    await expect(logError(new Error('test setup'))).resolves;
  });
});
