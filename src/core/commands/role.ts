import dbClient from '../../db/client';
import Command from './commandTypes';

const RoleCommand: Command = {
  name: 'role',
  description: 'Add a self-assignable role',
  type: 'CHAT_INPUT',
  options: [
    {
      type: 'ROLE',
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
    });

    if (!dbRole) {
      return await interaction.editReply('Could not determine if role is self-assignable');
    }
    if (!dbRole.selfAssignable) {
      return await interaction.editReply(`Role ${dbRole.name} is not self-assignable`);
    }

    await interaction.member.roles.add(roleToAdd);
    return await interaction.editReply(`Added role ${roleToAdd.name}`);
  },
};

export default RoleCommand;
