import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { createEmbeds, fakeFuzzySearch, logErrorFromCommand } from "../../utils";
import { MessageEmbed } from "discord.js";

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
        return await msg.say("too few letters provided in category name")

      let results = await getRepository(Category)
        .createQueryBuilder("cat")
        .innerJoin("cat.guild", "guild")
        .innerJoinAndSelect("cat.roles", "role")
        .andWhere("guild.id = :id", { id: msg.guild.id })
        .getMany();
  
      if (results.length === 0)
        return await msg.say(`There are no role categories yet.`);
  
      let catAskedFor: Category;
      try
      {
        catAskedFor = fakeFuzzySearch<Category>(catName, results);
      } catch (error)
      {
        console.error(error);
        return await msg.say(`${catName} category not found`);
      }
      
      let roleString = '';
  
      let rolesArr = catAskedFor.roles.sort((r1, r2) =>
        {
          if (r1.name < r2.name) return -1;
          if (r1.name > r2.name) return 1;
          return 0;
        });

      for (const role of rolesArr)
      {
        let discordRole = await msg.guild.roles.fetch(role.id);
        let memberSize = discordRole.members.reduce(a => ++a, 0);
        roleString = `${roleString}<@&${role.id}> - ${memberSize} members\n`;
      }

      let bigEmbed = new MessageEmbed({
        title: `${catAskedFor.name}`,
        description: roleString.slice(0, roleString.length - 1),
        fields: [
          {
            name: "selfAssignable",
            value: catAskedFor.selfAssignable
          }
        ],
        color: catAskedFor.defaultRoleColor
      });

      let embeds = createEmbeds(bigEmbed, '\n');

      return await Promise.all(embeds.map(e => msg.embed(e)));
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default ListRolesCommand;