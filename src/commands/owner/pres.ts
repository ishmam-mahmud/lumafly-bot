import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

type PresenceArgs = {
  name: string;
  status: string;
}

class Presence extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "pres",
      aliases: ["setpres", "setpresence", "status", "setstat", "setstatus"],
      group: "owner",
      memberName: "pres",
      description: "Set custom status for bot",
      args: [
        {
          key: "name",
          prompt: "What should the custom name be?",
          type: "string",
          default: "*",
        },
      ],
      ownerOnly: true,
    });
  }

  async run(msg: CommandoMessage, { name }: PresenceArgs)
  {
    if (name !== "*")
      await this.client.user.setPresence({ activity: { name } });
    else return await msg.say("Invalid custom status");
    
    return await msg.say(`Set status to Playing ${name}`);
  }
}

export default Presence;