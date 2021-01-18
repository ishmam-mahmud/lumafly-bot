import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { Message } from "discord.js"

class CatsCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "cats",
      group: "member",
      memberName: "cats",
      description: "Show the current self-assignable role categories.",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
    })
  }

  async run(msg: CommandoMessage)
  {
    let results = await getRepository(Category).find({
      selfAssignable: true,
      guild: {
        id: msg.guild.id,
      }
    });

    let embedSends:Promise<Message>[] = [];

    for (const cat of results)
    {
      embedSends.push(msg.channel.send({
        embed: {
          title: cat.name,
          color: cat.defaultRoleColor,
          description: `${cat.roles.length} roles`,
          fields: [{
            name: "id",
            value: `\`${cat.id}\``,
            inline: true,
          }, {
            name: "defaultRoleColor",
            value: `\`${cat.defaultRoleColor}\``,
            inline: true,
          }, {
            name: "Self-Assignable",
            value: cat.selfAssignable ? "Yes" : "No",
            inline: true,
          }],
        }
      }));
    }
    return await Promise.all(embedSends);
  }
}

export default CatsCommand;