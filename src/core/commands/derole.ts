import dbClient from '../../db/client';
import Command from './commandTypes';

const DeroleCommand: Command = {
  name: 'derole',
  description: 'Remove a role you currently have',
  options: [
    {
      type: 'ROLE',
      description: 'The role you want to remove',
      name: 'role-to-remove',
      required: true,
    },
  ],
  async execute(interaction) {
    await interaction.deferReply();
    const roleToRemove = interaction.options.getRole('role-to-remove');

    if (!roleToRemove) {
      throw 'Role not provided in options';
    }
    const dbRole = await dbClient.role.findFirst({
      where: {
        id: roleToRemove.id,
        selfAssignable: true,
        category: {
          serverId: interaction.guildId,
        },
      },
    });

    if (!dbRole) {
      return await interaction.editReply('Could not determine if role is self-manageable');
    }
    if (!dbRole.selfAssignable) {
      return await interaction.editReply(`Role ${dbRole.name} is not self-manageable`);
    }

    await interaction.member.roles.remove(roleToRemove);
    return await interaction.editReply(`Removed role ${roleToRemove.name}`);
  },
};

export default DeroleCommand;
