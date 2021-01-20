import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { Guild } from "../../entity/Guild"
import { getRepository } from "typeorm"

type AddCatCommandArgs = {
  name: string,
  defaultRoleColor: string,
  isSelfAssignable: boolean,
};

class AddCatCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "add_cat",
      group: "admin",
      memberName: "add_cat",
      description: "Add a role category, with an optional default color for new roles",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      args: [
        {
          key: "name",
          prompt: "What's the name of the category?",
          type: "string",
        },
        {
          key: "defaultRoleColor",
          prompt: "What's the default role color of the category?",
          type: "string",
          default: "*",
        },
        {
          key: "isSelfAssignable",
          prompt: "Will the roles in this category be self-assignable?",
          type: "boolean",
          default: false,
        },
      ]
    })
  }

  async run(msg: CommandoMessage, { name, defaultRoleColor, isSelfAssignable }: AddCatCommandArgs)
  {
    defaultRoleColor = defaultRoleColor.toUpperCase();
    let colorRe = /^#[A-F0-9]{6}$|^DEFAULT$|^\*$/;
    if (!colorRe.exec(defaultRoleColor))
      return await msg.say(`You need to pass a hex color code for the category color, or leave it empty`);

    let cat = await getRepository(Category)
      .findOne({
        name,
        guild: {
          id: msg.guild.id,
        },
      });

    if (cat)
      return await msg.say(`A category with that name already exists.`);

    let guild = await getRepository(Guild).findOne(msg.guild.id);

    cat = new Category();
    cat.name = name;
    cat.guild = guild;
    cat.roles = [];

    if (defaultRoleColor === '*')
      defaultRoleColor = "DEFAULT";
    cat.defaultRoleColor = defaultRoleColor;
    
    cat.selfAssignable = isSelfAssignable;
    let savedCat = await getRepository(Category).save(cat);

    guild.categories = [...guild.categories, cat];
    await getRepository(Guild).save(guild);
    return await msg.say(`${savedCat.name} has been added`);
  }
}

export default AddCatCommand;