import commands, { commandName } from '../commands';
import logError from '../logError';
import Event from './eventTypes';

const interactionCreateEvent: Event<'interactionCreate'> = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    if (interaction.isCommand()) {
      const command = commands[interaction.commandName as commandName];
      if (!command) return;
      if (command.type !== 'CHAT_INPUT') return;
      try {
        await command.execute(interaction);
      } catch (error) {
        const message = `Failed to handle ${interaction.commandName}`;
        if (interaction.deferred || interaction.replied) await interaction.editReply(message);
        else await interaction.reply({ content: message, ephemeral: true });
        await logError(error);
      }
    } else if (interaction.isContextMenu()) {
      const command = commands[interaction.commandName as commandName];
      if (!command) return;
      if (command.type !== 'MESSAGE' && command.type !== 'USER') return;
      try {
        await command.execute(interaction);
      } catch (error) {
        const message = `Failed to handle ${interaction.commandName}`;
        if (interaction.deferred || interaction.replied) await interaction.editReply(message);
        else await interaction.reply({ content: message, ephemeral: true });
        await logError(error);
      }
    }
  },
};

export default interactionCreateEvent;
