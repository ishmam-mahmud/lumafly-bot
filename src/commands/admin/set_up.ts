import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { Role } from "../../entity/Role"
import { Guild } from "../../entity/Guild"
import { getRepository } from "typeorm"

class SetUpCommand extends Command
{
  constructor(client: CommandoClient)
  {
    super(client, {
      name: "setup",
      group: "admin",
      memberName: "setup",
      description: "Setup the db entries for the existing server",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_GUILD"],
    })
  }

  async run(msg: CommandoMessage)
  {
    let dbGuild = await getRepository(Guild)
      .findOne(msg.guild.id)
  
    if (!dbGuild)
    {
      dbGuild = new Guild();
      dbGuild.id = msg.guild.id;
      dbGuild.name = msg.guild.name;
      dbGuild.categories = [];

      let uncat = new Category();
      uncat.name = "Uncategorized";
      uncat.guild = dbGuild;
      uncat.roles = [];
      uncat.selfAssignable = false;

      let roles = msg.guild.roles.cache.map(r =>
        {
          let role = new Role();
          role.category = uncat;
          role.name = r.name.replace("@", "");
          role.id = r.id;
          return role;
        });

      uncat.roles = roles;
      dbGuild.categories = [uncat];
        
      await getRepository(Guild).save(dbGuild);
      await getRepository(Category).save(uncat);
      await getRepository(Role).save(roles);
      return await msg.say(`${dbGuild.name} has been setup`);
    }
  }
}

export default SetUpCommand;