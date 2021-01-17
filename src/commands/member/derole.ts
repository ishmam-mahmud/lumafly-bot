import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"

type DeroleCommandArgs = {
  roleName: string;
}

class DeroleCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "derole",
      group: "member",
      memberName: "derole",
      description: "Remove a role from yourself, if a self-assignable cat owns it",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      args: [
        {
          key: "roleName",
          prompt: "What role do you want to remove?",
          type: "string",
          validate: (roleName: string) =>
          {
            return !/everyone/.exec(roleName);
          }
        }
      ]
    })
  }

  async run(msg: CommandoMessage, { roleName }: DeroleCommandArgs)
  {
    let results = await getRepository(Category).find({
      selfAssignable: true,
      guild: {
        id: msg.guild.id,
      }
    });

    for (const cat of results)
    {
      for (const role of cat.roles) {
        if (role.name === roleName)
        {
          await msg.member.roles.remove(role.id);
          return msg.say(`access removed from role ${role.name}. congratulation ?`);
        }
      }
    }
  }
}

export default DeroleCommand;