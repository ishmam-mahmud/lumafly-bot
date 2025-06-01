import { ChannelType } from 'discord.js';
import dbClient from '../../db/client';
import { getEnvRequired } from '../getEnv';
import type Event from './eventTypes';

const messageCreateEvent: Event<'messageCreate'> = {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    if (!message.guildId || !message.inGuild()) return;
    if (message.author.id === getEnvRequired('CLIENT_ID')) return;

    const dbGuild = await dbClient.server.findFirst({
      where: { id: message.guildId },
      select: { id: true, suggestionChannelId: true },
    });

    if (!dbGuild) {
      console.warn(`Message Event: Server ${message.guildId} not found in db`);
      return;
    }

    if (dbGuild.suggestionChannelId) {
      if (message.channelId === dbGuild.suggestionChannelId) {
        if (message.channel.type === ChannelType.GuildText) {
          const thread = await message.channel.threads.create({
            startMessage: message,
            name: `${message.member?.displayName} suggestion`,
            reason: 'new suggestion posted',
          });

          await Promise.all([
            message.react('👍'),
            message.react('👎'),
            thread.setRateLimitPerUser(
              30,
              'rate limit for suggestion discussions',
            ),
          ]);
        }
      }
    }
  },
};

export default messageCreateEvent;
