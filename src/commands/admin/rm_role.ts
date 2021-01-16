import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Role } from "../../entity/Role"
import { getRepository } from "typeorm"

type RmRoleCommandArgs = {
  id: string,
};

class RmRoleCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "rm_role",
      group: "admin",
      memberName: "rm_role",
      description: "Remove a role",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      ownerOnly: true,
      args: [
        {
          key: "id",
          prompt: "What's the id of the role you want to remove?",
          type: "string",
        },
      ]
    })
  }

  async run(msg: CommandoMessage, { id }: RmRoleCommandArgs)
  {
    let roleToRemove = await getRepository(Role)
      .createQueryBuilder()
      .where("id = :id", { id })
      .getOne();

    if (!roleToRemove)
      return await msg.say(`Role ${id} does not exist!`);
    
    let discordRole = await msg.guild.roles.fetch(id);
    discordRole = await discordRole.delete();

    roleToRemove = await getRepository(Role)
                    .remove(roleToRemove);

    return await msg.say(`${roleToRemove.name} has been deleted`);
  }
}

export default RmRoleCommand;