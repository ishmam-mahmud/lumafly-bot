import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"

type RoleCommandArgs = {
  roleName: string;
}

class RoleCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "role",
      group: "member",
      memberName: "role",
      description: "Assign a role to yourself, if a self-assignable cat owns it",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      args: [
        {
          key: "roleName",
          prompt: "What role do you want to add?",
          type: "string",
          validate: (roleName: string) =>
          {
            return !/everyone/.exec(roleName);
          }
        }
      ]
    })
  }

  async run(msg: CommandoMessage, { roleName }: RoleCommandArgs)
  {
    let results = await getRepository(Category).find({
      guild: {
        id: msg.guild.id,
      }
    });

    for (const cat of results)
    {
      for (const role of cat.roles)
      {
        if (role.name === roleName)
        {
          if (cat.selfAssignable)
          {
            await msg.member.roles.add(role.id);
            return await msg.say(`access granted to role ${role.name}. congratulation !`);
          }
          return await msg.say(`access denied to role ${role.name}.`);
        }
      }
    }

    return await msg.say(`${roleName} not found !`);
  }
}

export default RoleCommand;