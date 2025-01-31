import dbClient from '../../db/client';
import type Event from './eventTypes';

const roleCreateEvent: Event<'roleCreate'> = {
  name: 'roleCreate',
  once: false,
  async execute(role) {
    const uncategorized = await dbClient.roleCategory.findFirst({
      where: {
        name: 'Uncategorized',
        serverId: role.guild.id,
      },
      select: {
        id: true,
      },
    });

    if (!uncategorized) {
      console.error(
        `${role.guild.name} does not have an Uncategorized role category`,
      );
      return;
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

export default roleCreateEvent;
