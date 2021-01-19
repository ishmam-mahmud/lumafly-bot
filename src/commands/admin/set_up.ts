import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { logErrorFromCommand, setupCats } from "../../utils"
class SetUpCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "setup",
      group: "admin",
      memberName: "setup",
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
      let res = await setupCats(msg.guild);
      return await msg.say(res);
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default SetUpCommand;