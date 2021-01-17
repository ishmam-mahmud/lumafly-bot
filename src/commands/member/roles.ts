import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository } from "typeorm"
import { Message } from "discord.js"

class ListCatsCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "roles",
      group: "member",
      memberName: "roles",
      description: "Show the current self-assignable roles.",
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

    results.forEach(async cat =>
      {
        let roleString = '';
        cat.roles.forEach(r =>
          {
            roleString = `${roleString}${r.name} --- ${r.id}\n`
          });
        roleString = roleString.slice(0, roleString.length - 2);
        embedSends.push(msg.channel.send({
          embed: {
            title: cat.name,
            color: cat.defaultRoleColor,
            description: roleString,
          }
        }));
      });
    return await Promise.all(embedSends);
  }
}

export default ListCatsCommand;