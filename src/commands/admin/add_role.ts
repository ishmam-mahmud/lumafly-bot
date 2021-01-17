import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { getRepository } from "typeorm"
import { Category } from "../../entity/Category"
import { Role } from "../../entity/Role"

type AddRoleCommandArgs = {
  name: string,
  categoryName: string,
  color: string,
};

class AddRoleCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "add_role",
      group: "admin",
      memberName: "add_role",
      description: "Add a role, with the given name, to the given category",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      ownerOnly: true,
      args: [
        {
          key: "name",
          prompt: "What's the name of the role?",
          type: "string",
        },
        {
          key: "categoryName",
          prompt: "What category should the role be assigned to?",
          type: "string",
          default: "Uncategorized"
        },
        {
          key: "color",
          prompt: "What's the role color?",
          type: "string",
          validate: (defaultRoleColor: string) =>
          {
            let re = /^#[A-F0-9]{6}$|^DEFAULT$/;
            return re.exec(defaultRoleColor);
          },
          default: "DEFAULT",
        },
      ]
    })
  }
  


  async run(msg: CommandoMessage, { name, categoryName, color }: AddRoleCommandArgs)
  {

    let cat = await getRepository(Category)
      .findOne({
        name: categoryName,
        guild: {
          id: msg.guild.id,
        }
      });

    if (!cat)
      return await msg.say(`Category ${categoryName} does not exist for this server`);

    let newRole = await msg.guild.roles.create(
      {
        data: {
          name,
          color,
          mentionable: false,
        }
      });
    
    let dbRole = new Role();
    dbRole.id = newRole.id;
    dbRole.name = newRole.name;
    dbRole.category = cat;
    dbRole.color = color,

    await getRepository(Role).save(dbRole);

    cat.roles = [...cat.roles, dbRole];
    getRepository(Category).save(cat);

    return await msg.say(`${newRole.name} has been added`);
  }
}

export default AddRoleCommand;