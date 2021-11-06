import dbClient from '../../db/client';
import Event from './eventTypes';

const GuildDeleteEvent: Event<'guildDelete'> = {
  name: 'guildDelete',
  once: false,
  async execute(server) {
    const dbServer = await dbClient.server.findFirst({
      where: {
        id: server.id,
      },
      select: {
        id: true,
        RoleCategory: {
          select: {
            id: true,
            Role: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!dbServer) {
      console.log(`${server.name} not found in db in deletion. Skipping guildDelete`);
      return;
    }

    await dbClient.role.deleteMany({
      where: {
        id: {
          in: dbServer.RoleCategory.flatMap((cat) => cat.Role.map((role) => role.id)),
        },
      },
    });
    await dbClient.roleCategory.deleteMany({
      where: {
        id: {
          in: dbServer.RoleCategory.map((cat) => cat.id),
        },
      },
    });

    await dbClient.server.delete({
      where: {
        id: server.id,
      },
    });

    console.log(`${server.name} with ${server.id} deleted from db`);
  },
};

export default GuildDeleteEvent;
