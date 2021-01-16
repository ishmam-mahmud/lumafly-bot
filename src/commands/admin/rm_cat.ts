import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"

type RmCatCommandArgs = {
  name: string,
};

class RmCatCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "rm_cat",
      group: "admin",
      memberName: "rm_cat",
      description: "Remove a role category, and add all roles to Uncategorized",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      ownerOnly: true,
      args: [
        {
          key: "name",
          prompt: "What's the name of the category?",
          type: "string",
        },
      ]
    })
  }

  async run(msg: CommandoMessage, { name }: RmCatCommandArgs)
  {
    let catToRemove = await getRepository(Category)
      .createQueryBuilder()
      .where("name = :name", { name })
      .getOne();

    if (!catToRemove)
      return await msg.say(`${name} category does not exist!`);

    let uncat = await getRepository(Category)
      .createQueryBuilder()
      .where("name = :name", { name: "Uncategorized" })
      .getOne();

    uncat.roles = [...uncat.roles, ...catToRemove.roles];
    catToRemove.roles = [];

    await getRepository(Category).save(uncat);
    catToRemove = await getRepository(Category).remove(catToRemove);
    return await msg.say(`${catToRemove.name} has been deleted`);
  }
}

export default RmCatCommand;