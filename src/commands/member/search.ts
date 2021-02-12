import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Role as DiscordRole } from "discord.js";
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { Role } from "../../entity/Role"
import { fakeFuzzySearch, logErrorFromCommand } from "../../utils";

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
      aliases: ["find", "lookup"],
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

      let results = await getRepository(Category).find({
        selfAssignable: true,
        guild: {
          id: msg.guild.id,
        }
      });
  
      let rolesToSearchThrough: Role[] = [];

      for (const cat of results)
      {
        for (const role of cat.roles)
        {
          if (foundRoles.includes(role.name))
            rolesToSearchThrough.push(role)
        }
      }
  
      let roleString = '';
  
      let rolesArr = rolesToSearchThrough.sort((r1, r2) =>
        {
          if (r1.name < r2.name) return -1;
          if (r1.name > r2.name) return -1;
          return 0;
        });

      for (const r of rolesArr)
        roleString = `${roleString}<@&${r.id}>, `;

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