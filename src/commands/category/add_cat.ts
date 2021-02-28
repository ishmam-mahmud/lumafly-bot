import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Category } from "../../entity/Category";
import { Guild } from "../../entity/Guild";
import { getRepository } from "typeorm";
import { logErrorFromCommand } from "../../utils";

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
      group: "category",
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
          default: "*",
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
    });
  }

  async run(msg: CommandoMessage, { name, defaultRoleColor, isSelfAssignable }: AddCatCommandArgs): Promise<CommandoMessage>
  {
    try
    {
      if (name.length < 3)
        return await msg.say(`too few characters in the name`);

      defaultRoleColor = defaultRoleColor.toUpperCase();
      const colorRe = /^#[A-F0-9]{6}$|^DEFAULT$|^\*$/;
      if (!colorRe.exec(defaultRoleColor))
        return await msg.say(`You need to pass a hex color code for the category color, or leave it empty`);

      const guild = await getRepository(Guild)
        .createQueryBuilder("guild")
        .where("id = :id", { id: msg.guild.id })
        .getOne();

      if (!guild)
        return await msg.say(`Server has not been registered yet. Run \`${this.client.commandPrefix}setup\``);

      let cat = await getRepository(Category)
        .createQueryBuilder("cat")
        .innerJoin("cat.guild", "guild")
        .where("cat.name = :name", { name })
        .andWhere("guild.id = :id", { id: msg.guild.id })
        .getOne();

      if (cat)
        return await msg.say(`A category with that name already exists.`);

      if (defaultRoleColor === '*')
        defaultRoleColor = "DEFAULT";

      cat = new Category();
      cat.name = name;
      cat.roles = [];
      cat.defaultRoleColor = defaultRoleColor;
      cat.selfAssignable = isSelfAssignable;

      await getRepository(Category)
        .createQueryBuilder("cat")
        .insert()
        .values(cat).execute();

      await getRepository(Guild)
        .createQueryBuilder("guild")
        .relation("categories")
        .of(msg.guild.id)
        .add(cat.id);

      return await msg.say(`${cat.name} has been added`);
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default AddCatCommand;