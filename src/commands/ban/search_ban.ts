import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { logErrorFromCommand } from "../../utils"

type SearchBanArgs = {
  userID: string;
};

class SearchBanCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "get_ban",
      group: "ban",
      memberName: "get_ban",
      aliases: ["find_ban, search_ban"],
      description: "Search info about a ban by user ID",
      guildOnly: true,
      clientPermissions: ["BAN_MEMBERS"],
      userPermissions: ["BAN_MEMBERS"],
      args: [
        {
          key: "userID",
          prompt: "What's the user id of the banned user?",
          type: "string",
          default: "*",
        },
      ]
    })
  }

  async run(msg: CommandoMessage, { userID }: SearchBanArgs)
  {
    try
    {
      if (!/^\d{18}$/.exec(userID))
        return await msg.say("Please provide a valid user ID");

      let ban = await msg.guild.fetchBan(userID);

      if (ban)
      {
        return await msg.say({
          embed: {
            title: ban.user.tag,
            description: ban.reason,
            fields: [
              {
                name: "User ID",
                value: ban.user.id,
              },
            ],
          },
        });
      }
      return await msg.say("No users with that ID were banned");
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default SearchBanCommand;