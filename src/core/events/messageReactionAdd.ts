import dbClient from '../../db/client';
import getEnv from '../getEnv';
import Event from './eventTypes';

const messageReactionAddEvent: Event<'messageReactionAdd'> = {
  name: 'messageReactionAdd',
  once: false,
  async execute(reaction, user) {
    console.log(reaction.message.inGuild());
    if (reaction.me) return;
    if (reaction.message.author?.bot) return;
    if (!reaction.message.inGuild()) return;

    if (reaction.emoji.name === '💬') {
      if (reaction.users.cache.some((user) => user.id == getEnv('CLIENT_ID')))
        return;

      const newQuote = await dbClient.quote.create({
        data: {
          author: `<@${reaction.message.author}>`,
          text: reaction.message.content,
          messageLink: reaction.message.url,
          quotedAt: reaction.message.createdAt,
          serverId: reaction.message.guildId,
        },
        select: {
          id: true,
        },
      });

      if (!newQuote) {
        throw new Error(`Failed to add quote, ${reaction}`);
      }

      await reaction.message.channel.send(
        `New quote added by ${user.tag} as #${newQuote.id} (${reaction.message.url})`
      );
    }
  },
};

export default messageReactionAddEvent;
