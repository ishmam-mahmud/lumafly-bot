import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Category } from "../../entity/Category"
import { Role } from "../../entity/Role"
import { Guild } from "../../entity/Guild"
import { getRepository } from "typeorm"
import { shouldBeSelfAssignable } from "../../index";
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

      let uncat_nonSA = new Category();
      uncat_nonSA.name = "Uncategorized";
      uncat_nonSA.guild = dbGuild;
      uncat_nonSA.roles = [];
      uncat_nonSA.selfAssignable = false;
      
      let uncat_SA = new Category();
      uncat_SA.name = "Uncategorized_Assignable";
      uncat_SA.guild = dbGuild;
      uncat_SA.roles = [];
      uncat_SA.selfAssignable = true;

      let roles_SA = msg.guild.roles.cache.filter(r => shouldBeSelfAssignable(r))
        .map(r =>
          {
            let role = new Role();
            role.name = r.name.replace("@", "");
            role.id = r.id;
            role.category = uncat_SA;
            return role;
          })

      let roles_NonSA = msg.guild.roles.cache.filter(r => !shouldBeSelfAssignable(r))
        .map(r =>
          {
            let role = new Role();
            role.name = r.name.replace("@", "");
            role.id = r.id;
            role.category = uncat_nonSA;
            return role;
          })

      uncat_SA.roles = roles_SA;
      uncat_nonSA.roles = roles_NonSA;
      dbGuild.categories = [uncat_SA, uncat_nonSA];
        
      await getRepository(Guild).save(dbGuild);
      await getRepository(Category).save(uncat_SA);
      await getRepository(Category).save(uncat_nonSA);
      await getRepository(Role).save([...roles_NonSA, ...roles_SA]);
      return await msg.say(`${dbGuild.name} has been setup`);
    } else return await msg.say(`${dbGuild.name} has already been set up`);
  }
}

export default SetUpCommand;