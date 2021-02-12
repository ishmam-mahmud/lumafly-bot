import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { fakeFuzzySearch, logErrorFromCommand } from "../../utils";

type ListRoleArgs = {
  catName: string;
}

class ListRolesCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "ls_roles",
      aliases: ["list_roles"],
      group: "category",
      memberName: "ls_roles",
      description: "List roles belonging to a given cat.",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      args:[{
        key: "catName",
        prompt: "Which cat's roles do you want to see?",
        type: "string",
        default: "*",
      }]
    })
  }

  async run(msg: CommandoMessage, { catName }: ListRoleArgs)
  {
    try
    {
      if (catName.length < 3)
        catName = "*"
  
      let results = await getRepository(Category).find({
        guild: {
          id: msg.guild.id,
        }
      });
  
      if (results.length === 0)
        return await msg.say(`There are no role categories yet.`);
  
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
  
      let rolesArr = catAskedFor.roles.sort((r1, r2) =>
        {
          if (r1.name < r2.name) return -1;
          if (r1.name > r2.name) return -1;
          return 0;
        });
  
      let i = 0;
      let embedSends: Promise<CommandoMessage>[] = [];
      for (const r of rolesArr)
      {
        roleString = `${roleString}<@&${r.id}> : ${r.id}\n`;
        ++i;
        if (i % 20 === 0 || i === rolesArr.length)
        {
          embedSends.push(msg.say({
            embed: {
              title: `${catAskedFor.name} : ID${catAskedFor.id}`,
              color: catAskedFor.defaultRoleColor,
              description: roleString,
              fields: [
                {
                  name: "Default Color",
                  value: catAskedFor.defaultRoleColor,
                },
                {
                  name: "Self-Assignable",
                  value: catAskedFor.selfAssignable,
                },
              ]
            }
          }));
          roleString = ``;
        }
      }
      return await Promise.all(embedSends);
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default ListRolesCommand;