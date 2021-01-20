import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { Role } from "../../entity/Role"
import { getRepository } from "typeorm"

type RmCatCommandArgs = {
  nameCatToRemove: string,
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
      userPermissions: ["MANAGE_GUILD"],
      args: [
        {
          key: "nameCatToRemove",
          prompt: "What's the name of the category to be removed?",
          type: "string",
          default: "*"
        },
      ]
    })
  }

  async run(msg: CommandoMessage, { nameCatToRemove }: RmCatCommandArgs)
  {
    if (/Uncategorized/.exec(nameCatToRemove))
      return await msg.say("No removing the Uncategorized category");
    
    if (nameCatToRemove.length < 3)
      return await msg.say("too few characters in the given cat's name");

    let catToRemove = await getRepository(Category)
      .findOne({
        name: nameCatToRemove,
        guild: {
          id: msg.guild.id,
        },
      });

    if (!catToRemove)
      return await msg.say(`${nameCatToRemove} category does not exist!`);

    let uncat = await getRepository(Category)
      .findOne({
        name: "Uncategorized",
        guild: {
          id: msg.guild.id,
        }
      });

    let roles = catToRemove.roles.map(r =>
      {
        r.category = uncat;
        return r;
      })

    uncat.roles = [...uncat.roles, ...roles];
    catToRemove.roles = [];

    await getRepository(Role).save(roles);
    await getRepository(Category).save(uncat);
    catToRemove = await getRepository(Category).remove(catToRemove);
    return await msg.say(`${catToRemove.name} has been deleted`);
  }
}

export default RmCatCommand;