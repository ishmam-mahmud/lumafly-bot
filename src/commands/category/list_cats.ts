import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Category } from "../../entity/Category";
import { getRepository } from "typeorm";
import { logErrorFromCommand } from "../../utils";
import { MessageEmbed } from "discord.js";

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
    });
  }

  async run(msg: CommandoMessage): Promise<CommandoMessage>
  {
    try
    {
      const categories = await getRepository(Category)
        .createQueryBuilder("cat")
        .innerJoin("cat.guild", "guild")
        .leftJoinAndSelect("cat.roles", "roles")
        .where("guild.id = :id", { id: msg.guild.id })
        .getMany();

      if (categories.length === 0)
        return await msg.say(`There are no role categories yet.`);

      const catsArr = categories.sort((c1, c2) =>
      {
        if (c1.name < c2.name) return -1;
        if (c1.name > c2.name) return 1;
        return 0;
      });

      let catString = '';
      for (const cat of catsArr)
        catString = `${catString}ID-${cat.id} : ${cat.name} : ${cat.roles.length} roles : ${cat.defaultRoleColor} color\n`;

      catString = `${catString}\nUse \`${this.client.commandPrefix}ls_roles <categoryName>\` to see the roles in a category.`;

      return await msg.embed(new MessageEmbed({
        title: "Role Categories",
        description: catString,
      }));
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default ListCatsCommand;