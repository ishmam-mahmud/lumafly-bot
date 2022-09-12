import dbClient from '../../db/client';
import Event from './eventTypes';

const guildCreateEvent: Event<'guildCreate'> = {
  name: 'guildCreate',
  once: false,
  async execute(server) {
    const foundServer = await dbClient.server.findFirst({
      where: {
        id: server.id,
      },
      select: {
        id: true,
      },
    });

    if (foundServer) {
      console.log(`${server.name} is already registered in DB`);
      return;
    }

    const newServer = await dbClient.server.create({
      data: {
        id: server.id,
        name: server.name,
        RoleCategory: {
          create: {
            name: 'Uncategorized',
            Role: {
              createMany: {
                data: server.roles.cache.map((role) => ({
                  id: role.id,
                  name: role.name,
                  selfAssignable: false,
                })),
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    console.log(`${server.name} with ${newServer.id} initialized in DB`);
  },
};

export default guildCreateEvent;
