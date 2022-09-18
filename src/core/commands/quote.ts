import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
} from 'discord.js';
import dbClient from '../../db/client';
import { ChatInputCommandInteractionHandler } from './commandTypes';

const quoteCommand: ChatInputCommandInteractionHandler = {
  name: 'quote',
  type: ApplicationCommandType.ChatInput,
  description: 'Get an existing quote',
  // TODO: Set options
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: 'user',
      description: 'Get a quote by',
      required: false,
    },
  ],
  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getUser('user', false);

    let quoteIdArray;
    if (user) {
      const userIdSQLString = `%${user.id}%`;
      quoteIdArray =
        await dbClient.$queryRaw`SELECT id FROM "Quote" WHERE author LIKE ${userIdSQLString} ORDER BY RANDOM() LIMIT 1`;
    } else {
      quoteIdArray =
        await dbClient.$queryRaw`SELECT id FROM "Quote" ORDER BY RANDOM() LIMIT 1`;
    }

    if (!Array.isArray(quoteIdArray) || quoteIdArray.length === 0) {
      throw new Error('No quotes found');
    }

    const quoteId = quoteIdArray[0].id;

    const quote = await dbClient.quote.findFirst({
      where: {
        id: quoteId,
      },
    });

    if (!quote) {
      throw new Error(`No quote found with id ${quoteId}`);
    }

    let embedDescription = `${quote.text}\n-${quote.author}`;
    if (quote.messageLink !== null) {
      embedDescription = `${embedDescription} [(Jump)](${quote.messageLink})`;
    }

    const embed = new EmbedBuilder()
      .setTitle(`#${quote.id}`)
      .setDescription(embedDescription);

    return await interaction.editReply({
      embeds: [embed],
    });
  },
};

export default quoteCommand;
