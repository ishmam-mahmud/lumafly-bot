import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { logErrorFromCommand } from "../../utils"

class ListCatsCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "ls_cats",
      aliases: ["list_cats"],
      group: "category",
      memberName: "ls_cats",
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
      let categories = await getRepository(Category)
        .createQueryBuilder("cat")
        .innerJoin("cat.guild", "guild")
        .innerJoinAndSelect("cat.roles", "roles")
        .where("guild.id = :id", { id: msg.guild.id })
        .getMany();
  
      if (categories.length === 0)
        return await msg.say(`There are no role categories yet.`);
  
      let catString = '';
      for (const cat of categories)
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