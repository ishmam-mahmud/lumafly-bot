import commands from '../commands';
import Event from './eventTypes';

const interactionCreateEvent: Event<'interactionCreate'> = {
  name: 'interactionCreate',
  once: true,
  async execute(interaction) {
    if (interaction.isCommand()) {
      const command = commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error', ephemeral: true });
      }
    }
  },
};

export default interactionCreateEvent;
