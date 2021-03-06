import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { logErrorFromCommand } from "../../utils";

class LsBansCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "bans",
      group: "admin",
      memberName: "bans",
      aliases: ["ls_bans"],
      description: "List all the bans of this server",
      guildOnly: true,
      clientPermissions: ["BAN_MEMBERS"],
      userPermissions: ["BAN_MEMBERS"],
    });
  }

  async run(msg: CommandoMessage): Promise<CommandoMessage | CommandoMessage[]>
  {
    try
    {
      const bans = await msg.guild.fetchBans();

      let banString = ``;

      const embedSends: Promise<CommandoMessage>[] = [];

      bans.forEach(ban =>
      {
        banString = `${banString}${ban.user.tag} - ${ban.user.id}\n`;
        if (banString.length > 1900)
        {
          embedSends.push(msg.say({
            embed: {
              title: "Bans",
              description: banString
            },
          }));
          banString = ``;
        }
      });

      if (banString !== ``)
        embedSends.push(msg.say({
          embed: {
            title: "Bans",
            description: banString
          },
        }));

      if (embedSends.length === 0)
        return await msg.say("No one has been banned yet.");

      return await Promise.all(embedSends);
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default LsBansCommand;