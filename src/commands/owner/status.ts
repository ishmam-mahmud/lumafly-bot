import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

type PresenceArgs = {
  name: string;
  status: string;
};

class Presence extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "status",
      aliases: ["setstatus"],
      group: "owner",
      memberName: "status",
      description: "Set custom status for bot",
      args: [
        {
          key: "name",
          prompt: "What should the custom name be?",
          type: "string",
          default: "Hades",
        },
      ],
      ownerOnly: true,
    });
  }

  async run(msg: CommandoMessage, { name }: PresenceArgs): Promise<CommandoMessage>
  {
    await this.client.user.setPresence({ activity: { name } });
    return await msg.say(`Set status to \`Playing ${name}\``);
  }
}

export default Presence;