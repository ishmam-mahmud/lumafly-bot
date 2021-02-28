import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { getRepository } from "typeorm";
import { Guild } from "../../entity/Guild";
import { Category } from "../../entity/Category";
import { Role } from "../../entity/Role";
import { logErrorFromCommand } from "../../utils";

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
      group: "category",
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
          default: "*",
        },
        {
          key: "newCatName",
          prompt: "What category should the role be moved to?",
          type: "string",
          default: "*",
        },
      ],
    });
  }



  async run(msg: CommandoMessage, { name, newCatName }: MoveRoleCommandArgs): Promise<CommandoMessage>
  {
    try
    {
      if (/everyone/.exec(name))
        return await msg.say("No moving everyone around");

      if (name.length < 3)
        return await msg.say("too few characters in the role name");

      if (newCatName.length < 3)
        return await msg.say("too few characters in the destination cat name");

      const guild = await getRepository(Guild)
        .createQueryBuilder("guild")
        .innerJoinAndSelect("guild.categories", "cat")
        .innerJoinAndSelect("cat.roles", "role")
        .where("guild.id = :id", { id: msg.guild.id })
        .getOne();

      if (!guild)
        return await msg.say(`Server DB has not been setup yet. Run ${this.client.commandPrefix}setup again`);

      const newCat = await getRepository(Category)
        .createQueryBuilder("cat")
        .innerJoin("cat.guild", "guild")
        .leftJoinAndSelect("cat.roles", "roles")
        .where("cat.name = :name", { name: newCatName })
        .andWhere("guild.id = :id", { id: msg.guild.id })
        .getOne();

      if (!newCat)
        return await msg.say(`${newCatName} category does not exist`);

      for (const role of newCat.roles)
      {
        if (name === role.name)
          return await msg.say(`${newCat.name} already has a ${name} role`);
      }

      let currCat: Category;
      let targetRole: Role;

      for (const cat of guild.categories)
      {
        for (const role of cat.roles)
        {
          if (role.name === name)
          {
            targetRole = role;
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
          return await msg.say("You need to have the Manage Server permission to change the self-assignability of a role");
      }

      await getRepository(Category)
        .createQueryBuilder("cat")
        .relation("roles")
        .of(currCat.id)
        .remove(targetRole.id);

      await getRepository(Category)
        .createQueryBuilder("cat")
        .relation("roles")
        .of(newCat.id)
        .add(targetRole.id);

      return await msg.say(`${targetRole.name} has been moved from ${currCat.name} to ${newCat.name}`);
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default MoveRoleCommand;