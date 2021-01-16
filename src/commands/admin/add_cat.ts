import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"

type AddCatCommandArgs = {
  name: string,
  defaultHexColor: string,
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
      ownerOnly: true,
      args: [
        {
          key: "name",
          prompt: "What's the name of the category?",
          type: "string",
        },
        {
          key: "defaultHexColor",
          prompt: "What's the default role color of the category?",
          type: "string",
          validate: (defaultHexColor: string) =>
          {
            let re = /^#[A-F0-9]{6}$/;
            return re.exec(defaultHexColor);
          }
        },
      ]
    })
  }

  async run(msg: CommandoMessage, { name, defaultHexColor }: AddCatCommandArgs)
  {
    let cat = new Category();
    cat.name = name;
    cat.defaultRoleColor = defaultHexColor;
    cat.roles = [];
    let savedCat = await getRepository(Category).save(cat);
    return await msg.say(`${savedCat.name} has been added`);
  }
}

export default AddCatCommand;