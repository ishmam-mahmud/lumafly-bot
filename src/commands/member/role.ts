import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { Role } from "../../entity/Role"

type RoleCommandArgs = {
  roleName: string;
}

class RoleCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "role",
      group: "member",
      memberName: "role",
      description: "Assign a role to yourself, if a self-assignable cat owns it",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      args: [
        {
          key: "roleName",
          prompt: "What role do you want to add?",
          type: "string",
          validate: (roleName: string) =>
          {
            return !/everyone/.exec(roleName);
          }
        }
      ]
    })
  }

  async run(msg: CommandoMessage, { roleName }: RoleCommandArgs)
  {
    for (const role of msg.member.roles.cache.values())
    {
      let dsRoleName = role.name.toLowerCase().trim();
      let input = roleName.toLowerCase().trim();
      if (dsRoleName.includes(input))
      {
        return await msg.say(`You already have the ${role.name} role`);
      }  
    }

    let results = await getRepository(Category).find({
      selfAssignable: true,
      guild: {
        id: msg.guild.id,
      }
    });

    let foundRoles: Map<number, Role> = new Map<number, Role>();
    for (const cat of results)
    {
      for (const role of cat.roles)
      {
        let dbName = role.name.toLowerCase();
        let input = roleName.toLowerCase().trim();

        let foundIndex = dbName.indexOf(input);
        if (foundIndex !== -1)
        {
          if (!foundRoles.has(foundIndex))
            foundRoles.set(foundIndex, role);
        }
      }
    }

    if (foundRoles.size > 0)
    {
      let i = 0;
      while (!foundRoles.has(i))
        ++i;
      let roleToAssign = foundRoles.get(i); 
      try
      {
        await msg.member.roles.add(roleToAssign.id);
      } catch (error)
      {
        let e = `msg.url\n${error.message}`;
        console.error(msg.url);
        console.error(error);
        await msg.author.send(e);
        return await msg.say(`:pensive: I failed`);  
      }
      return await msg.say(`access granted to role ${roleToAssign.name}. congratulation !`);
    }

    return await msg.say(`${roleName} not found !`);
  }
}

export default RoleCommand;