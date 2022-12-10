import commands, { commandName } from "../commands";
import {
  ChatInputCommandInteractionHandler,
  ContextMenuCommandInteractionHandler,
} from "../commands/commandTypes";
import Event from "./eventTypes";

const interactionCreateEvent: Event<"interactionCreate"> = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    console.log(interaction);
    if (!interaction.inCachedGuild()) return;
    if (interaction.isChatInputCommand()) {
      const command = commands[
        interaction.commandName as commandName
      ] as ChatInputCommandInteractionHandler;
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        const message = `Failed to handle ${interaction.commandName}`;
        if (interaction.deferred || interaction.replied)
          await interaction.editReply(message);
        else await interaction.reply({ content: message, ephemeral: true });
        throw error;
      }
    } else if (interaction.isContextMenuCommand()) {
      const command = commands[
        interaction.commandName as commandName
      ] as ContextMenuCommandInteractionHandler;
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        const message = `Failed to handle ${interaction.commandName}`;
        if (interaction.deferred || interaction.replied)
          await interaction.editReply(message);
        else await interaction.reply({ content: message, ephemeral: true });
        throw error;
      }
    }
  },
};

export default interactionCreateEvent;
