import dbClient from '../../db/client';
import getEnv from '../getEnv';
import Command from './commandTypes';

//TODO: Delete after initial server setup
const DumpCommand: Command = {
  name: 'dump',
  description: 'Reset command for server',
  options: [],
  async execute(interaction) {
    if (interaction.user.id !== getEnv('CLIENT_OWNER')) {
      return await interaction.reply('owner only');
    }
    const server = await dbClient.server.findFirst({
      where: {
        id: interaction.guildId,
      },
      select: {
        id: true,
        RoleCategory: {
          select: {
            id: true,
            Role: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!server) return interaction.reply(`${interaction.guild?.name} not found`);

    await dbClient.role.deleteMany({
      where: {
        id: {
          in: server.RoleCategory.flatMap((cat) => cat.Role.map((role) => role.id)),
        },
      },
    });
    await dbClient.roleCategory.deleteMany({
      where: {
        id: {
          in: server.RoleCategory.map((cat) => cat.id),
        },
      },
    });

    await dbClient.server.delete({
      where: {
        id: server.id,
      },
    });

    return await interaction.reply(`${interaction.guild?.name} reset`);
  },
};
export default DumpCommand;
