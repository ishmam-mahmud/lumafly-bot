import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository, PrimaryColumn } from "typeorm"
import { Message } from "discord.js"

class ListCatsCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "list_cats",
      group: "admin",
      memberName: "list_cats",
      description: "List current role categories.",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
    })
  }

  async run(msg: CommandoMessage)
  {
    let results = await getRepository(Category).find({
      guild: {
        id: msg.guild.id,
      }
    });

    let embedSends:Promise<Message>[] = [];

    for (const cat of results)
    {
      let roleString = '';
      let counter = 0;
      
      for (let i = 0; i < cat.roles.length; ++i)
      {
        const role = cat.roles[i];
        roleString = `${roleString}${role.name} --- ${role.id}\n`
        ++counter;
        if (counter === 50 || i === cat.roles.length - 1)
        {
          embedSends.push(msg.channel.send({
            embed: {
              title: cat.name,
              color: cat.defaultRoleColor,
              description: roleString,
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
          counter = 0;
          roleString = '';
        }
      }
    }
    return await Promise.all(embedSends);
  }
}

export default ListCatsCommand;