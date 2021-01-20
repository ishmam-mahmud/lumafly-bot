import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Role } from "../../entity/Role"
import { Category } from "../../entity/Category"
import { Guild } from "../../entity/Guild"
import { getRepository } from "typeorm"
import { logErrorFromCommand, setupCats } from "../../utils"
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
      let r = await getRepository(Role).find();
      await getRepository(Role).remove(r);
      let c = await getRepository(Category).find();
      await getRepository(Category).remove(c);
      let g = await getRepository(Guild).find();
      await getRepository(Guild).remove(g);
      return await msg.say(`${msg.guild.name} has been cleared. Run setup again`);
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default DumpCommand;