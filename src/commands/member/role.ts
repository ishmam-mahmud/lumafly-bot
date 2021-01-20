import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { Role } from "../../entity/Role"
import { fakeFuzzySearch, logErrorFromCommand } from "../../utils";

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
          default: "*"
        }
      ]
    })
  }

  async run(msg: CommandoMessage, { roleName }: RoleCommandArgs)
  {
    if (/everyone/.exec(roleName))
      return await msg.say("no");
    
    if (roleName.length < 3)
      return await msg.say("too few characters from the role name");

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

    let rolesToSearchThrough: Role[] = [];
    for (const cat of results)
    {
      rolesToSearchThrough = [...rolesToSearchThrough, ...cat.roles];
    }

    let foundRole: Role;
    try
    {
      foundRole = fakeFuzzySearch(roleName, rolesToSearchThrough) as Role;
    } catch (error)
    {
      console.error(error);
      return await msg.say(`${roleName} role not found among self-assignable roles`);  
    }

    try
    {
      await msg.member.roles.add(foundRole.id);
      return await msg.say(`access granted to role ${foundRole.name}. congratulations !`);
    } catch (error)
    {
      await logErrorFromCommand(error, msg);
      return await msg.say(`:pensive: I failed`);
    }
  }
}

export default RoleCommand;