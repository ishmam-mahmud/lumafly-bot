import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { Role } from "../../entity/Role"
import { getRepository } from "typeorm"

type DeroleCommandArgs = {
  roleName: string;
}

class DeroleCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "derole",
      group: "member",
      memberName: "derole",
      description: "Remove a role from yourself, if a self-assignable cat owns it",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      args: [
        {
          key: "roleName",
          prompt: "What role do you want to remove?",
          type: "string",
          validate: (roleName: string) =>
          {
            return !/everyone/.exec(roleName);
          }
        }
      ]
    })
  }

  async run(msg: CommandoMessage, { roleName }: DeroleCommandArgs)
  {
    let found = false;
    for (const role of msg.member.roles.cache.values())
    {
      let dsRoleName = role.name.toLowerCase().trim();
      let input = roleName.toLowerCase().trim();
      if (dsRoleName.includes(input))
      {
        found = true;
        break;
      }
    }
    if (!found)
      return await msg.say(`You don't have that role, whatever it is.`);

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
      let roleToRemove = foundRoles.get(i); 
      try
      {
        await msg.member.roles.remove(roleToRemove.id);
      } catch (error)
      {
        let e = `msg.url\n${error.message}`;
        console.error(msg.url);
        console.error(error);
        await msg.author.send(e);
        return await msg.say(`:pensive: I failed`);  
      }
      return await msg.say(`access removed from role ${roleToRemove.name}. congratulation ?`);
    }

    return await msg.say(`${roleName} not found !`);
  }
}

export default DeroleCommand;