import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"

type EditCatCommandArgs = {
  name: string,
  newName: string,
  newRoleColor: string,
  isSelfAssignable: string,
};

class EditCatCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "edit_cat",
      group: "admin",
      memberName: "edit_cat",
      description: "Edit the properties of a role category",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      ownerOnly: true,
      args: [
        {
          key: "name",
          prompt: "What's the name of the category?",
          type: "string",
          validate: (name: string) =>
          {
            return !/Uncategorized/.exec(name);
          },
        },
        {
          key: "newName",
          prompt: "What's the new name of the category?",
          type: "string",
          validate: (newName: string) =>
          {
            return !/Uncategorized/.exec(newName);
          },
          default: "-",
        },
        {
          key: "newRoleColor",
          prompt: "What's the new default role color of the category?",
          type: "string",
          validate: (newRoleColor: string) =>
          {
            let re = /^#[A-F0-9]{6}$|^DEFAULT$|^-$/;
            return re.exec(newRoleColor);
          },
          default: "-"
        },
        {
          key: "isSelfAssignable",
          prompt: "Will the roles in this category be self-assignable? Use `y`/`n`",
          type: "string",
          default: "-"
        },
      ]
    })
  }

  async run(msg: CommandoMessage, { name, newName, newRoleColor, isSelfAssignable }: EditCatCommandArgs)
  {
    
    let cat = await getRepository(Category)
      .findOne({
        name,
        guild: {
          id: msg.guild.id,
        }
      });
    
    if (!cat)
      return await msg.say(`${name} category does not exist`);
    
    if (newName !== "-")
      cat.name = newName;

    if(newRoleColor !== "-")
      cat.defaultRoleColor = newRoleColor;

    if(isSelfAssignable !== "-")
    {
      if (isSelfAssignable.toLowerCase() === "y")
        cat.selfAssignable = true;
      if (isSelfAssignable.toLowerCase() === "n")
        cat.selfAssignable = false;
    }
    let savedCat = await getRepository(Category).save(cat);
    return await msg.say(`${savedCat.name} has been edited`);
  }
}

export default EditCatCommand;