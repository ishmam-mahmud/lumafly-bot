import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Role } from "../../entity/Role"
import { Category } from "../../entity/Category"
import { Guild } from "../../entity/Guild"
import { getRepository } from "typeorm"
import { logErrorFromCommand } from "../../utils"
class DumpCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "dump",
      group: "admin",
      memberName: "dump",
      description: "Setup the db entries for the existing server",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["ADMINISTRATOR"],
    })
  }

  async run(msg: CommandoMessage)
  {
    try
    {
      let roles = await getRepository(Role)
        .createQueryBuilder("role")
        .innerJoin("role.category", "cat")
        .innerJoin("cat.guild", "guild")
        .where("guild.id = :id", { id: msg.guild.id })
        .select(["role.id"])
        .getMany();

      await getRepository(Role)
        .createQueryBuilder("role")
        .delete()
        .whereInIds(roles.map(r => r.id))
        .execute();

      await getRepository(Category)
        .createQueryBuilder("cat")
        .innerJoin("cat.guild", "guild")
        .delete()
        .where("guild.id = :id", { id: msg.guild.id })
        .execute();

      await getRepository(Guild)
        .createQueryBuilder("guild")
        .delete()
        .where("guild.id = :id", { id: msg.guild.id })
        .execute();

      return await msg.say(`${msg.guild.name} has been cleared. Run ${this.client.commandPrefix}setup again to reseed.`);
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default DumpCommand;