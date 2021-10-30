import Command from './commandTypes';

const PingCommand: Command = {
  name: 'ping',
  description: '',
  async execute(interaction) {
    await interaction.reply('PONG');
  },
};

export default PingCommand;
