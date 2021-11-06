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
    const roleToRemove = interaction.options.getRole('role-to-remove');

    await interaction.deferReply();

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
      return await interaction.reply('Could not determine if role is self-manageable');
    }
    if (!dbRole.selfAssignable) {
      return await interaction.reply(`Role ${dbRole.name} is not self-manageable`);
    }

    await interaction.member.roles.remove(roleToRemove);
    return await interaction.reply(`Removed role ${roleToRemove.name}`);
  },
};

export default DeroleCommand;
