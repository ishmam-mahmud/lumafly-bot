import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import dbClient from '../../db/client';
import { type ChatInputCommandInteractionHandler } from './commandTypes';

const rolesCommand: ChatInputCommandInteractionHandler = {
  name: 'roles',
  description: 'See a list of all self-assignable roles',
  type: ApplicationCommandType.ChatInput,
  options: [],
  async execute(interaction) {
    await interaction.deferReply({ flags: 'Ephemeral' });
    const categories = await dbClient.roleCategory.findMany({
      where: {
        Role: { some: { selfAssignable: true } },
        serverId: interaction.guildId,
      },
      orderBy: { name: 'asc' },
      select: {
        name: true,
        Role: { select: { id: true, selfAssignable: true, name: true } },
      },
    });

    if (categories.length === 0) {
      return await interaction.editReply('No categories setup.');
    }

    return await interaction.editReply({
      embeds: categories.map((cat) => {
        return new EmbedBuilder().setTitle(cat.name).setDescription(
          cat.Role.filter((role) => role.selfAssignable)
            .sort((roleA, roleB) => {
              if (roleA.name < roleB.name) return -1;
              return 1;
            })
            .map((role) => `<@&${role.id}>`)
            .join(','),
        );
      }),
    });
  },
};

export default rolesCommand;
