import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { getRepository, PrimaryColumn } from "typeorm"
import { Message } from "discord.js"
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants"

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
      selfAssignable: true,
      guild: {
        id: msg.guild.id,
      }
    });

    if (results.length === 0)
      return await msg.say(`${catName} category not found`);

    let foundCats: Map<number, Category> = new Map<number, Category>();
    for (const cat of results)
    {
      let dbName = cat.name.toLowerCase();
      let input = catName.toLowerCase().trim();
      
      let foundIndex = dbName.indexOf(input);
      if (foundIndex !== -1)
      {
        if (!foundCats.has(foundIndex))
          foundCats.set(foundIndex, cat);
      }
    }

    if (foundCats.size > 0)
    {
      let i = 0;
      while (!foundCats.has(i))
        ++i;
      let catAskedFor = foundCats.get(i);
      let roleString = '';
      let counter = 0;
      let embedSends:Promise<Message>[] = [];
      
      for (let i = 0; i < catAskedFor.roles.length; ++i)
      {
        const role = catAskedFor.roles[i];
        roleString = `${roleString}${role.name}, `
        ++counter;
        if (counter === 50 || i === catAskedFor.roles.length - 1)
        {
          embedSends.push(msg.channel.send({
            embed: {
              title: catAskedFor.name,
              color: catAskedFor.defaultRoleColor,
              description: roleString.slice(0, roleString.length - 2),
              fields: [{
                name: "defaultRoleColor",
                value: `\`${catAskedFor.defaultRoleColor}\``,
                inline: true,
              }],
            }
          }));
          counter = 0;
          roleString = '';
        }
      }
      return await Promise.all(embedSends);
    } return await msg.say(`${catName} category not found`);
  }
}

export default RolesCommand;