import commands, { commandName } from '../commands';
import logError from '../logError';
import Event from './eventTypes';

const interactionCreateEvent: Event<'interactionCreate'> = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction) {
    if (interaction.isCommand() && interaction.inCachedGuild()) {
      const command = commands[interaction.commandName as commandName];
      if (!command) return;
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
