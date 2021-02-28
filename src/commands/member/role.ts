import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { getRepository } from "typeorm";
import { Role } from "../../entity/Role";
import { fakeFuzzySearch, logErrorFromCommand } from "../../utils";

type RoleCommandArgs = {
  roleName: string;
};

class RoleCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "role",
      group: "member",
      memberName: "role",
      aliases: ["petcat", "patcat", "cat"],
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
    });
  }

  async run(msg: CommandoMessage, { roleName }: RoleCommandArgs): Promise<CommandoMessage>
  {
    try
    {
      if (/everyone/.exec(roleName))
        return await msg.say("no");

      if (roleName.length < 3)
        return await msg.say("too few characters from the role name");

      for (const role of msg.member.roles.cache.values())
      {
        const dsRoleName = role.name.toLowerCase().trim();
        const input = roleName.toLowerCase().trim();
        if (dsRoleName === input)
        {
          return await msg.say(`You already have the ${role.name} role`);
        }
      }

      const rolesToSearchThrough = await getRepository(Role)
        .createQueryBuilder("role")
        .innerJoin("role.category", "cat")
        .innerJoin("cat.guild", "guild")
        .where("cat.selfAssignable = :s", { s: true })
        .andWhere("guild.id = :id", { id: msg.guild.id })
        .getMany();

      let foundRole: Role;
      try
      {
        foundRole = fakeFuzzySearch<Role>(roleName, rolesToSearchThrough);
      } catch (error)
      {
        console.error(error);
        return await msg.say(`${roleName} role not found among self-assignable roles`);
      }
      await msg.member.roles.add(foundRole.id);
      return await msg.say(`access granted to role ${foundRole.name}. congratulations !`);
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default RoleCommand;