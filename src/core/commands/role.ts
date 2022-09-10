import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord.js';
import dbClient from '../../db/client';
import { ChatInputCommandInteractionHandler } from './commandTypes';

const RoleCommand: ChatInputCommandInteractionHandler = {
  name: 'role',
  type: ApplicationCommandType.ChatInput,
  description: 'Add a self-assignable role',
  options: [
    {
      type: ApplicationCommandOptionType.Role,
      description: 'The role you want to add',
      name: 'role-to-add',
      required: true,
    },
  ],
  async execute(interaction) {
    await interaction.deferReply();
    const roleToAdd = interaction.options.getRole('role-to-add');
    if (!roleToAdd) {
      return await interaction.editReply('Role not provided in options');
    }
    const dbRole = await dbClient.role.findFirst({
      where: {
        id: roleToAdd.id,
        selfAssignable: true,
        category: {
          serverId: interaction.guildId,
        },
      },
      select: {
        id: true,
        selfAssignable: true,
      },
    });

    if (!dbRole) {
      return await interaction.editReply(
        'Could not determine if role is self-assignable'
      );
    }
    if (!dbRole.selfAssignable) {
      return await interaction.editReply(
        `Role ${roleToAdd.name} is not self-assignable`
      );
    }

    await interaction.member.roles.add(roleToAdd);
    return await interaction.editReply(`Added role ${roleToAdd.name}`);
  },
};

export default RoleCommand;
