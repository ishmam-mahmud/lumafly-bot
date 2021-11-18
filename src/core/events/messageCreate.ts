import dbClient from '../../db/client';
import getEnv from '../getEnv';
import Event from './eventTypes';

const MessageCreateEvent: Event<'messageCreate'> = {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    if (!message.guildId || !message.inGuild()) return;
    if (message.author.id === getEnv('CLIENT_ID')) return;

    const dbGuild = await dbClient.server.findFirst({
      where: {
        id: message.guildId,
      },
    });

    if (!dbGuild) {
      console.error(`Message Event: Server with ${message.guildId} not found in db`);
      return;
    }

    if (dbGuild.suggestionChannelId) {
      if (message.channelId === dbGuild.suggestionChannelId) {
        if (message.channel.type === 'GUILD_TEXT') {
          const thread = await message.channel.threads.create({
            startMessage: message,
            name: `${message.member?.nickname} suggestion`,
            reason: 'new suggestion posted',
          });

          await Promise.all([
            message.react('👍'),
            message.react('👎'),
            thread.setRateLimitPerUser(30, 'rate limit for suggestion discussions'),
          ]);
        }
      }
    }
  },
};

export default MessageCreateEvent;
