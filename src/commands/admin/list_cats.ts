import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { logErrorFromCommand } from "../../utils"

class ListCatsCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "list_cats",
      aliases: ["ls_cats"],
      group: "admin",
      memberName: "list_cats",
      description: "List current role categories.",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
    })
  }

  async run(msg: CommandoMessage)
  {
    try
    {
      let results = await getRepository(Category).find({
        guild: {
          id: msg.guild.id,
        }
      });
  
      if (results.length === 0)
        return await msg.say(`There are no role categories yet.`);
  
      let catString = '';
      for (const cat of results)
        catString = `${catString}ID-${cat.id} : ${cat.name} : ${cat.roles.length} roles : ${cat.defaultRoleColor} color\n`
      
      catString = `${catString}\nUse \`${this.client.commandPrefix}ls_roles <categoryName>\` to see the roles in a category.`;
  
      return await msg.channel.send({
        embed: {
          title: "Role Categories",
          description: catString,
        },
      });
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }

  }
}

export default ListCatsCommand;