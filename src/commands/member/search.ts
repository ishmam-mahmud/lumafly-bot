import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { Role } from "../../entity/Role"
import { logErrorFromCommand } from "../../utils";

type SearchCommandArgs = {
  roleName: string;
}

class SearchCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "search",
      group: "member",
      memberName: "search",
      aliases: ["find", "lookup", "findcat"],
      description: "Search for roles with a search query",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      args: [
        {
          key: "roleName",
          prompt: "What role are you looking for?",
          type: "string",
          default: "*"
        }
      ]
    })
  }

  async run(msg: CommandoMessage, { roleName }: SearchCommandArgs)
  {
    try
    {
      if (/everyone/.exec(roleName))
        return await msg.say("no");
      
      if (roleName.length < 3)
        return await msg.say("too few characters from the role name");
  
      let foundRoles: string[] = [];
      for (const role of msg.guild.roles.cache.values())
      {
        let dsRoleName = role.name.toLowerCase().trim();
        let input = roleName.toLowerCase().trim();
        if (dsRoleName.includes(input))
          foundRoles.push(role.name);
      }
  
      let dbRoles = await getRepository(Role)
        .createQueryBuilder("role")
        .innerJoin("role.category", "cat")
        .innerJoin("cat.guild", "guild")
        .where("cat.selfAssignable = :s", { s: true })
        .andWhere("guild.id = :id", { id: msg.guild.id })
        .getMany();

      let rolesFound = dbRoles.filter(r =>
        {
          return foundRoles.includes(r.name);
        }).sort((r1, r2) =>
        {
          if (r1.name < r2.name) return -1;
          if (r1.name > r2.name) return -1;
          return 0;
        })
  
      let roleString = '';

      rolesFound.forEach(r =>
        {
          roleString = `${roleString}<@&${r.id}>, `;
        });

      let description = roleString.length > 0 ? roleString.slice(0, roleString.length - 2) : "No results found";

      return await msg.say({
        embed: {
          title: `Results for \`${roleName}\``,
          description,
        },
      });
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);    
    }
  }
}

export default SearchCommand;