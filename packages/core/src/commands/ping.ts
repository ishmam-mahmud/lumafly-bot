import Command from './commandTypes';

const PingCommand: Command = {
  name: 'ping',
  description: 'Replies with pong',
  async execute(interaction) {
    await interaction.reply('PONG');
  },
};

export default PingCommand;
