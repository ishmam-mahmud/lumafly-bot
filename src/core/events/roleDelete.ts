import dbClient from '../../db/client';
import type Event from './eventTypes';

const roleDeleteEvent: Event<'roleDelete'> = {
  name: 'roleDelete',
  once: false,
  async execute(role) {
    const dbRole = await dbClient.role.findFirst({
      where: {
        id: role.id,
        category: {
          serverId: role.guild.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!dbRole) {
      console.log(
        `${role.name} with id ${role.id} for ${role.guild.name} with server id ${role.guild.id} not found.`,
      );
      console.log('Skipping roleDelete');
      return;
    }

    await dbClient.role.delete({
      where: {
        id: role.id,
      },
    });
    console.log(
      `${role.name} with id ${role.id} for ${role.guild.name} with server id ${role.guild.id} deleted.`,
    );
  },
};

export default roleDeleteEvent;
