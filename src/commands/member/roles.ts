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
      description: "List roles belonging to a given self-assignable cat.",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      args:[{
        key: "catName",
        prompt: "Which cat's roles do you want to see?",
        type: "string",
        validate: (catName: string) =>
        {
          return catName.length > 3;
        }
      }]
    })
  }

  async run(msg: CommandoMessage, { catName }: RolesArgs)
  {
    let results = await getRepository(Category).find({
      selfAssignable: true,
      guild: {
        id: msg.guild.id,
      }
    });

    if (results.length === 0)
      return await msg.say(`${catName} category not found`);

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
        fields: [{
          name: "Number of Roles",
          value: `${catAskedFor.roles.length}`,
        }],
      },
    });
  }
}

export default RolesCommand;