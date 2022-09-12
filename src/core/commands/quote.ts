import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import dbClient from '../../db/client';
import { ChatInputCommandInteractionHandler } from './commandTypes';

const quoteCommand: ChatInputCommandInteractionHandler = {
  name: 'quote',
  type: ApplicationCommandType.ChatInput,
  description: 'Get an existing quote',
  // TODO: Set options
  options: [],
  async execute(interaction) {
    await interaction.deferReply();
    const quoteIds = await dbClient.quote.findMany({
      where: {
        serverId: interaction.guildId,
      },
      select: {
        id: true,
      },
    });

    const randomQuoteId = quoteIds[Math.floor(Math.random() * quoteIds.length)];

    const quote = await dbClient.quote.findFirst({
      where: {
        id: randomQuoteId.id,
      },
    });

    if (!quote) {
      throw new Error(`No quote found with id ${randomQuoteId.id}`);
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
