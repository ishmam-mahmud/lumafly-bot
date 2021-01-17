import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { getRepository } from "typeorm"
import { Category } from "../../entity/Category"
import { Role } from "../../entity/Role"

type MoveRoleCommandArgs = {
  name: string,
  currCatName: string,
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
      description: "Move a role from one category to another",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      ownerOnly: true,
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
          key: "currCatName",
          prompt: "What's the current role category?",
          type: "string",
        },
        {
          key: "newCatName",
          prompt: "What category should the role be moved to?",
          type: "string",
        },
      ]
    })
  }
  


  async run(msg: CommandoMessage, { name, currCatName, newCatName, }: MoveRoleCommandArgs)
  {

    console.log(name);

    let currCat = await getRepository(Category)
      .findOne({
        name: currCatName,
        guild: {
          id: msg.guild.id,
        }
      });

    let newCat = await getRepository(Category)
      .findOne({
        name: newCatName,
        guild: {
          id: msg.guild.id,
        }
      });

    let dbRole = await getRepository(Role)
      .findOne({
        name,
        category: {
          name: currCatName,
          id: currCat.id,
        },
      });
    
    if (!dbRole)
      return msg.say(`${name} role does not exist`);
    
    if (!currCat)
      return msg.say(`${currCatName} category does not exist`);

    if (!newCat)
      return msg.say(`${newCatName} category does not exist`);

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