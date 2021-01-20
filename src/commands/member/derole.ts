import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { Role } from "../../entity/Role"
import { getRepository } from "typeorm"
import { fakeFuzzySearch, logErrorFromCommand } from "../../utils";

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
          default: "*",
        }
      ],
    })
  }

  async run(msg: CommandoMessage, { roleName }: DeroleCommandArgs)
  {
    if (/everyone/.exec(roleName))
      return await msg.say("no");
  
    if (roleName.length < 3)
      return await msg.say("too few characters from the role name");

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

    let rolesToSearchThrough: Role[] = [];
    for (const cat of results)
    {
      rolesToSearchThrough = [...rolesToSearchThrough, ...cat.roles];
    }

    rolesToSearchThrough = rolesToSearchThrough.filter(r =>
      {
        return msg.member.roles.cache.has(r.id);
      })

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
      await msg.member.roles.remove(foundRole.id);
      return await msg.say(`access removed from role ${foundRole.name}. congratulation ?`);
    } catch (error)
    {
      await logErrorFromCommand(error, msg);
      return await msg.say(`:pensive: I failed`);
    }
  }
}

export default DeroleCommand;