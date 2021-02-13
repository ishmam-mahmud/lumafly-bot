import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { logErrorFromCommand } from "../../utils";

type EditCatCommandArgs = {
  name: string,
  newName: string,
  newRoleColor: string,
  isSelfAssignable: string,
};

class EditCatCommand extends Command
{
  truthy: Set<string>;
  falsy: Set<string>;
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "edit_cat",
      group: "category",
      memberName: "edit_cat",
      description: "Edit the properties of a role category",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_GUILD"],
      args: [
        {
          key: "name",
          prompt: "What's the name of the category?",
          type: "string",
          default: "*",
        },
        {
          key: "newName",
          prompt: "What's the new name of the category?",
          type: "string",
          default: "*",
        },
        {
          key: "newRoleColor",
          prompt: "What's the new default role color of the category?",
          type: "string",
          default: "*"
        },
        {
          key: "isSelfAssignable",
          prompt: "Will the roles in this category be self-assignable? Use `y`/`n`",
          type: "string",
          default: "*"
        },
      ]
    })
    this.truthy = new Set(['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+']);
    this.falsy = new Set(['false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-']);
  }

  async run(msg: CommandoMessage, { name, newName, newRoleColor, isSelfAssignable }: EditCatCommandArgs)
  {
    try
    {
      if (/Uncategorized/.exec(name))
        return await msg.say("No editing the uncategorized category");
      
      if (name.length < 3)
        return await msg.say("too few characters in the name");
  
      if (/Uncategorized/.exec(newName))
        return await msg.say("No usurping the Uncategorized category");
  
      if (newName.length < 3)
        newName = "*";
  
      newRoleColor = newRoleColor.toUpperCase();
      let colorRe = /^#[A-F0-9]{6}$|^DEFAULT$|^\*$/;
      if (!colorRe.exec(newRoleColor))
        return await msg.say(`You need to pass a hex color code for the category color, or leave it empty`);

      let cat = await getRepository(Category)
        .createQueryBuilder("cat")
        .innerJoin("cat.guild", "guild")
        .where("cat.name = :name", { name })
        .andWhere("guild.id = :id", { id: msg.guild.id })
        .getOne();

      if (!cat)
        return await msg.say(`No category with the name ${name} exists for this server.`);
  
      let checkCat = await getRepository(Category)
        .createQueryBuilder("cat")
        .innerJoin("cat.guild", "guild")
        .where("cat.name = :name", { name: newName })
        .andWhere("guild.id = :id", { id: msg.guild.id })
        .getOne();
      
      if (checkCat)
        return await msg.say(`There's already a category with the name ${newName}`);
      
      if (newName !== "*")
        cat.name = newName;
  
      if(newRoleColor !== "*")
        cat.defaultRoleColor = newRoleColor;
  
      if(isSelfAssignable !== "*")
      {
        if (this.truthy.has(isSelfAssignable))
          cat.selfAssignable = true;
        if (this.falsy.has(isSelfAssignable))
          cat.selfAssignable = false;
      }

      await getRepository(Category)
        .createQueryBuilder("cat")
        .update()
        .set(cat)
        .where("id = :id", { id: cat.id })
        .execute();

      return await msg.say(`${cat.name} has been edited`);
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default EditCatCommand;