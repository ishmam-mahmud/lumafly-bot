import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Category } from "../../entity/Category";
import { getRepository } from "typeorm";
import { logErrorFromCommand } from "../../utils";

type RmCatCommandArgs = {
  nameCatToRemove: string,
};

class RmCatCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "rm_cat",
      group: "category",
      memberName: "rm_cat",
      description: "Remove a role category, and add all roles to Uncategorized",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_GUILD"],
      args: [
        {
          key: "nameCatToRemove",
          prompt: "What's the name of the category to be removed?",
          type: "string",
          default: "*"
        },
      ]
    });
  }

  async run(msg: CommandoMessage, { nameCatToRemove }: RmCatCommandArgs): Promise<CommandoMessage>
  {
    try
    {
      if (/Uncategorized/.exec(nameCatToRemove))
        return await msg.say("No removing the Uncategorized category");

      if (nameCatToRemove.length < 3)
        return await msg.say("too few characters in the given cat's name");

      const catToRemove = await getRepository(Category)
        .createQueryBuilder("cat")
        .innerJoin("cat.guild", "guild")
        .leftJoinAndSelect("cat.roles", "role")
        .where("cat.name = :n", { n: nameCatToRemove })
        .andWhere("guild.id = :id", { id: msg.guild.id })
        .getOne();

      if (!catToRemove)
        return await msg.say(`${nameCatToRemove} category does not exist!`);

      const uncat = await getRepository(Category)
        .createQueryBuilder("cat")
        .innerJoin("cat.guild", "guild")
        .where("cat.name = :n", { n: "Uncategorized" })
        .andWhere("guild.id = :id", { id: msg.guild.id })
        .getOne();

      const roleRemoves = catToRemove.roles.map(r =>
      {
        return getRepository(Category)
          .createQueryBuilder("cat")
          .relation("roles")
          .of(catToRemove.id)
          .remove(r.id);
      });
      await Promise.all(roleRemoves);

      const roleAdds = catToRemove.roles.map(r =>
      {
        return getRepository(Category)
          .createQueryBuilder("cat")
          .relation("roles")
          .of(uncat.id)
          .add(r.id);
      });
      await Promise.all(roleAdds);

      await getRepository(Category)
        .createQueryBuilder("cat")
        .delete()
        .where("id = :id", { id: catToRemove.id })
        .execute();

      return await msg.say(`${catToRemove.name} has been deleted`);
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default RmCatCommand;