import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
} from "discord.js";
import dbClient from "../../db/client";
import { ChatInputCommandInteractionHandler } from "./commandTypes";

const quoteCommand: ChatInputCommandInteractionHandler = {
  name: "quote",
  type: ApplicationCommandType.ChatInput,
  description: "Get an existing quote",
  // TODO: Set options
  options: [
    {
      type: ApplicationCommandOptionType.Integer,
      name: "quote_id",
      description: "Get a quote by id",
      required: false,
    },
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "Get a quote by user",
      required: false,
    },
  ],
  async execute(interaction) {
    await interaction.deferReply();
    const id = interaction.options.getInteger("quote_id", false);
    const user = interaction.options.getUser("user", false);

    let quoteIdArray;
    if (id) {
      if (id <= 0) {
        return await interaction.editReply(
          `Invalid id ${id}. ID must be an integer greater than 0.`
        );
      }
      console.log(`Fetching quote with id ${id}`);
      quoteIdArray = [{ id: id }];
    } else if (user) {
      console.log(`Fetching random quote by ${user.id}`);
      const userIdSQLString = `%${user.id}%`;
      quoteIdArray =
        await dbClient.$queryRaw`SELECT id FROM "Quote" WHERE author LIKE ${userIdSQLString} ORDER BY RANDOM() LIMIT 1`;
    } else {
      console.log("Fetching random quote");
      quoteIdArray =
        await dbClient.$queryRaw`SELECT id FROM "Quote" ORDER BY RANDOM() LIMIT 1`;
    }

    if (!Array.isArray(quoteIdArray) || quoteIdArray.length === 0) {
      throw new Error("No quote ids found");
    }

    const quoteId = quoteIdArray[0].id;

    const quote = await dbClient.quote.findFirst({
      where: {
        id: quoteId,
      },
    });

    if (!quote) {
      return await interaction.editReply(`No quote found with id ${quoteId}`);
    }

    let embedDescription = `${quote.text}\n-${quote.author}`;
    if (quote.messageLink !== null) {
      console.log(`Adding quote message link to description for ${quote.id}`);
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
