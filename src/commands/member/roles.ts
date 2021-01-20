import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { fakeFuzzySearch } from "../../utils";

type RolesArgs = {
  catName: string;
}

class RolesCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "roles",
      group: "member",
      memberName: "roles",
      aliases: ["cats"],
      description: "List roles belonging to a given self-assignable cat.",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      args:[{
        key: "catName",
        prompt: "Which cat's roles do you want to see?",
        type: "string",
        default: "*"
      }]
    })
  }

  async run(msg: CommandoMessage, { catName }: RolesArgs)
  {
    if (catName.length < 3)
      catName = "*"

    let results = await getRepository(Category).find({
      selfAssignable: true,
      guild: {
        id: msg.guild.id,
      }
    });

    if (results.length === 0)
      return await msg.say(`There are no self-assignable role categories yet.`);

    if (catName === "*")
    {
      let catString = '';
      for (const cat of results)
        catString = `${catString}${cat.name} - ${cat.roles.length} roles\n`
      
      catString = `${catString}\nUse \`${this.client.commandPrefix}roles <categoryName>\` to see the roles in a category.`;
  
      return await msg.channel.send({
        embed: {
          title: "Role Categories",
          description: catString,
        },
      });
    }

    let catAskedFor: Category;
    try
    {
      catAskedFor = fakeFuzzySearch(catName, results) as Category;
    } catch (error)
    {
      console.error(error);
      return await msg.say(`${catName} category not found`);
    }
    
    let roleString = '';

    for (const r of catAskedFor.roles)
      roleString = `${roleString}${r.name}, `;

    return await msg.say({
      embed: {
        title: catAskedFor.name,
        color: catAskedFor.defaultRoleColor,
        description: roleString.slice(0, roleString.length - 2),
      },
    });
  }
}

export default RolesCommand;