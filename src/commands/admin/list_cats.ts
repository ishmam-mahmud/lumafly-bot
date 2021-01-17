import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"

class ListCatsCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "list_cats",
      group: "admin",
      memberName: "list_cats",
      description: "List current role categories.",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      ownerOnly: true,
    })
  }

  async run(msg: CommandoMessage)
  {
    let results = await getRepository(Category).find({
      guild: {
        id: msg.guild.id,
      }
    });

    let response = '';

    results.forEach(cat =>
      {
        response = `${response}**${cat.name}**\n`
        cat.roles.forEach(r =>
          {
            response = `${response}- ${r.name}\n`
          });
      });
    return await msg.say(response);
  }
}

export default ListCatsCommand;