import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { getRepository } from "typeorm"
import { Guild } from "../../entity/Guild"
import { Category } from "../../entity/Category"
import { Role } from "../../entity/Role"

type MoveRoleCommandArgs = {
  name: string,
  newCatName: string,
};

class MoveRoleCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "move_role",
      group: "admin",
      memberName: "move_role",
      description: "Move a role to a different category",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      args: [
        {
          key: "name",
          prompt: "What's the name of the role?",
          type: "string",
          validate: (name: string) => {
            return !/everyone/.exec(name);
          }
        },
        {
          key: "newCatName",
          prompt: "What category should the role be moved to?",
          type: "string",
        },
      ]
    })
  }
  


  async run(msg: CommandoMessage, { name, newCatName }: MoveRoleCommandArgs)
  {
    let newCat = await getRepository(Category)
      .findOne({
        name: newCatName,
        guild: {
          id: msg.guild.id,
        }
      });
    
    if (!newCat)
      return await msg.say(`${newCatName} category does not exist`);

    for (const role of newCat.roles)
    {
      if (name === role.name)
        return await msg.say(`${newCat.name} already has a ${name} role`);
    }

    let guild = await getRepository(Guild).findOne(msg.guild.id);
    let currCat: Category;

    for (const cat of guild.categories) {
      for (const role of cat.roles) {
        if (role.name === name)
        {
          currCat = cat;
          break;
        }
      }
    }
    
    if (!currCat)
      return await msg.say(`${name} role was not found`);

    if (currCat.id === newCat.id)
      return await msg.say(`${name} is already in ${newCat.name} category`);

    if (!currCat.selfAssignable || currCat.selfAssignable !== newCat.selfAssignable)
    {
      if (!msg.member.permissions.has("MANAGE_GUILD"))
        return await msg.reply("You need to have the Manage Server permission to change the self-assignability of a role");
    }

    let dbRole = await getRepository(Role)
      .findOne({
        name,
        category: {
          id: currCat.id,
        },
      });

    if (newCat.selfAssignable)
    {
      let discRole = await msg.guild.roles.fetch(dbRole.id);
      discRole = await discRole.setColor(newCat.defaultRoleColor);
    }
    
    dbRole.category = newCat;
    newCat.roles = [...newCat.roles, dbRole];
    currCat.roles = currCat.roles.filter(r => r.name !== name);

    dbRole = await getRepository(Role).save(dbRole);
    newCat = await getRepository(Category).save(newCat);
    currCat = await getRepository(Category).save(currCat);

    return await msg.say(`${dbRole.name} has been moved from ${currCat.name} to ${newCat.name}`);
  }
}

export default MoveRoleCommand;