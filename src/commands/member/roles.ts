import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository, PrimaryColumn } from "typeorm"
import { Message } from "discord.js"

type RolesArgs = {
  catName: string;
}

class RolesCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "roles",
      group: "member",
      memberName: "roles",
      description: "List roles belonging to a given self-assignable cat.",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      args:[{
        key: "catName",
        prompt: "Which cat's roles do you want to see?",
        type: "string",
      }]
    })
  }

  async run(msg: CommandoMessage, { catName }: RolesArgs)
  {
    let results = await getRepository(Category).find({
      name: catName,
      selfAssignable: true,
      guild: {
        id: msg.guild.id,
      }
    });

    if (results.length === 0)
      return await msg.say(`${catName} category not found`);

    let embedSends:Promise<Message>[] = [];

    for (const cat of results)
    {
      let roleString = '';
      let counter = 0;
      
      for (let i = 0; i < cat.roles.length; ++i)
      {
        const role = cat.roles[i];
        roleString = `${roleString}${role.name}\n`
        ++counter;
        if (counter === 50 || i === cat.roles.length - 1)
        {
          embedSends.push(msg.channel.send({
            embed: {
              title: cat.name,
              color: cat.defaultRoleColor,
              description: roleString,
              fields: [{
                name: "defaultRoleColor",
                value: `\`${cat.defaultRoleColor}\``,
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

export default RolesCommand;