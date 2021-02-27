import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { fakeFuzzySearch, logErrorFromCommand, createEmbeds } from "../../utils";
import { MessageEmbed } from "discord.js"

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
    try
    {
      if (catName.length < 3)
        catName = "*"

      let results = await getRepository(Category)
        .createQueryBuilder("cat")
        .innerJoin("cat.guild", "guild")
        .innerJoinAndSelect("cat.roles", "role")
        .where("cat.selfAssignable = :s", { s: true })
        .andWhere("guild.id = :id", { id: msg.guild.id })
        .getMany();

      if (results.length === 0)
        return await msg.say(`There are no self-assignable role categories yet.`);

      let catsArr = results.sort((c1, c2) =>
        {
          if (c1.name < c2.name) return -1;
          if (c1.name > c2.name) return 1;
          return 0;
        });
  
      if (catName === "*")
      {
        let catString = '';
        for (const cat of catsArr)
          catString = `${catString}${cat.name} : ${cat.roles.length} roles\n`
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
  
      for (const r of rolesArr)
        roleString = `${roleString}<@&${r.id}>, `;

      let bigEmbed = new MessageEmbed().
        setTitle(catAskedFor.name).
        setColor(catAskedFor.defaultRoleColor).
        setDescription(roleString.slice(0, roleString.length - 2));
      
      let embeds = createEmbeds(bigEmbed, ", ");

      return await Promise.all(embeds.map(e => msg.say({
        embed: {
          title: e.title,
          color: e.color,
          description: e.description,
        },
      })));
  
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default RolesCommand;