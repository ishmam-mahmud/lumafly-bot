import dbClient from '../../db/client';
import Event from './eventTypes';

const RoleCreateEvent: Event<'roleCreate'> = {
  name: 'roleCreate',
  once: false,
  async execute(role) {
    const dbRole = await dbClient.role.findFirst({
      where: {
        name: role.name,
        category: {
          serverId: role.guild.id,
        },
      },
    });

    if (dbRole) {
      await role.delete('A role with the same name already exists in the server');
    }

    const uncategorized = await dbClient.roleCategory.findFirst({
      where: {
        name: 'Uncategorized',
        serverId: role.guild.id,
      },
    });

    if (!uncategorized) {
      throw new Error(`${role.guild.name} does not have an Uncategorized role category`);
    }

    await dbClient.role.create({
      data: {
        id: role.id,
        name: role.name,
        selfAssignable: false,
        roleCategoryId: uncategorized.id,
      },
    });
  },
};

export default RoleCreateEvent;
