import dbClient from '../../db/client';
import getEnv from '../getEnv';
import Event from './eventTypes';

const MessageEvent: Event<'message'> = {
  name: 'message',
  once: false,
  async execute(message) {
    if (!message.guildId) return;
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
        await Promise.all([message.react('👍'), message.react('👎')]);
        console.log(
          `Successfully reacted to message with id ${message.id} in suggestions channel of ${dbGuild.name} `
        );
      }
    }
  },
};

export default MessageEvent;
