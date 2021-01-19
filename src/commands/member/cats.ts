import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { Message } from "discord.js"

class CatsCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "cats",
      group: "member",
      memberName: "cats",
      description: "Show the current self-assignable role categories.",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
    })
  }

  async run(msg: CommandoMessage)
  {
    let results = await getRepository(Category).find({
      selfAssignable: true,
      guild: {
        id: msg.guild.id,
      }
    });

    let catString = '';
    for (const cat of results)
      catString = `${catString}${cat.name} - ${cat.roles.length} roles\n`

    return await msg.channel.send({
      embed: {
        title: "Role Categories",
        description: catString,
      }
    });
  }
}

export default CatsCommand;