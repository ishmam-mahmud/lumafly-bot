import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { Role } from "../../entity/Role"

type AddRoleCommandArgs = {
  name: string,
  categoryName: string,
  defaultHexColor: string,
  isSelfAssignable: boolean,
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
          key: "defaultHexColor",
          prompt: "What's the role color?",
          type: "string",
          default: "DEFAULT",
        },
        {
          key: "isSelfAssignable",
          prompt: "Is the role self-assignable?",
          type: "boolean",
          default: false,
        }
      ]
    })
  }
  


  async run(msg: CommandoMessage, { name, categoryName, defaultHexColor, isSelfAssignable }: AddRoleCommandArgs)
  {
    let cat = await getRepository(Category)
      .createQueryBuilder("cat")
      .where("name = :name", { name: categoryName })
      .leftJoinAndSelect("cat.roles, role")
      .getOne();

    if (!cat)
      return await msg.say(`Category ${categoryName} does not exist`);

    let newRole = await msg.guild.roles.create(
      {
        data: {
          name,
          color: defaultHexColor,
          mentionable: false,
        }
      });
    
    let dbRole = new Role();
    dbRole.hexColor = defaultHexColor,
    dbRole.id = newRole.id;
    dbRole.name = newRole.name;
    dbRole.selfAssignable = isSelfAssignable;

    if (!cat.roles) cat.roles =
    cat.roles.push(dbRole);
    getRepository(Category).save(cat);

    return await msg.say(`${newRole.name} has been added`);
  }
}

export default AddRoleCommand;