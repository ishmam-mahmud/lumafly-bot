import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { logErrorFromCommand } from "../../utils"
import { getRepository } from "typeorm"
import { Guild } from "../../entity/Guild";

type SetArgs = {
  setting: string,
  value: string,
}

class SetCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "set",
      group: "setting",
      memberName: "set",
      description: "Set a specific bot setting for this server",
      guildOnly: true,
      clientPermissions: ["SEND_MESSAGES"],
      userPermissions: ["MANAGE_GUILD"],
      details: `Set specific server settings.\nSet suggestions channel id for automatic reactions with \`${client.commandPrefix}set sug <channelID>\`.`,
      args: [
        {
          key: "setting",
          prompt: "Which setting do you want to set the value for?",
          type: "string",
          default: "",
        },
        {
          key: "value",
          prompt: "What value do you want to set?",
          type: "string",
          default: "",
        }
      ]
    })
  }

  async run(msg: CommandoMessage, { setting, value }: SetArgs)
  {
    try
    {
      switch (setting)
      {
        case "sug":
          if (!/^\d{18}$/.exec(value))
            return await msg.say("Please provide a valid channel ID");

          const channel = msg.guild.channels.cache.get(value);
          if (!channel)
            return await msg.say("Could not find any channels with that id");

          let dbGuild = await getRepository(Guild)
            .createQueryBuilder("guild")
            .where("guild.id = :id", { id: msg.guild.id })
            .getOne();

          if (!dbGuild)
            return await msg.say(`Server DB has not been setup yet. Run ${this.client.commandPrefix}setup again`);

          await getRepository(Guild)
            .createQueryBuilder("guild")
            .update()
            .set({config: { suggestionsChannelID: channel.id }})
            .where("guild.id = :id", { id: msg.guild.id })
            .execute();

          return await msg.say(`${channel} set as the suggestions channel for this server`);
        default:
          let temp = setting;
          if (!setting || setting === "")
            temp = "that";
          return await msg.say(`${temp} is not a valid setting.`);
      }
    } catch (error)
    {
      return await logErrorFromCommand(error, msg);
    }
  }
}

export default SetCommand;