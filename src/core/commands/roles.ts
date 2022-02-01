import { MessageEmbed } from 'discord.js';
import dbClient from '../../db/client';
import Command from './commandTypes';

const RolesCommand: Command = {
  name: 'roles',
  description: 'See a list of all self-assignable roles',
  type: 'CHAT_INPUT',
  options: [],
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const categories = await dbClient.roleCategory.findMany({
      where: {
        Role: {
          some: {
            selfAssignable: true,
          },
        },
        serverId: interaction.guildId,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        name: true,
        Role: {
          select: {
            id: true,
            selfAssignable: true,
            name: true,
          },
        },
      },
    });

    return await interaction.editReply({
      embeds: categories.map((cat) => {
        return new MessageEmbed().setTitle(cat.name).setDescription(
          cat.Role.filter((role) => role.selfAssignable)
            .sort((roleA, roleB) => {
              if (roleA.name < roleB.name) return -1;
              return 1;
            })
            .map((role) => `<@&${role.id}>`)
            .join(',')
        );
      }),
    });
  },
};

export default RolesCommand;
