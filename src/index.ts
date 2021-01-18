import { CommandoClient } from "discord.js-commando";
import path from "path";
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { Category } from "./entity/Category"
import { Guild } from "./entity/Guild"
import { Role } from "./entity/Role"
import { Role as DiscordRole } from "discord.js";

const client = new CommandoClient({
  commandPrefix: process.env.PREFIX,
  owner: process.env.OWNER,
  presence: {
    status: "dnd",
  },
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["admin", "Admin Commands"],
    ["member", "Member Commands"]
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, "commands"))

// if (client.registry.unknownCommand)
//   client.registry.unregisterCommand(client.registry.unknownCommand);

client.once("ready", async () =>
{
  console.log(`Logged in as ${client.user?.tag}. (${client.user?.id})`);
  await client.user?.setPresence({ activity: { name: "with your cats" }, status: "online" });

  let retries = 5;
  while (retries > 0)
  {
    try
    {
      // await createConnection();
      await createConnection({
        type: "better-sqlite3",
        database: "./db/prod.sql",
        synchronize: true,
        logging: true,
        entities: [
          "dist/entity/**/*.js"
        ],
        migrations: [
          "dist/migration/**/*.js"
        ],
        subscribers: [
          "dist/subscriber/**/*.js"
        ],
        cli: {
          "entitiesDir": "dist/entity",
          "migrationsDir": "dist/migration",
          "subscribersDir": "dist/subscriber"
        },
    });
      break;
    } catch (error)
    {
      console.error(error);
      console.error(`Retries left = ${retries}`);
      --retries;
      await new Promise((res, rej) =>
      {
        setTimeout(res, 5000);
      });
    }
  }
})

const shouldBeSelfAssignable = (role: DiscordRole) =>
{
  if (role.permissions.has("MANAGE_ROLES"))
    return false;
  
  if (role.managed)
    return false;

  let specialRoles = ["Muted", "OK Booster", "@everyone", "New-Best-Friend", "Den-Opt-In", "Partnership", "Engineer", "no-pictures", "Member", "botless"];

  if (specialRoles.findIndex(s => s === role.name) !== -1)
    return false;

  return true;
}

client.on("guildCreate", async guild =>
{
  let dbGuild = await getRepository(Guild)
    .findOne(guild.id)
  
  if (!dbGuild)
  {
    dbGuild = new Guild();
    dbGuild.id = guild.id;
    dbGuild.name = guild.name;
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

    let roles_SA = guild.roles.cache.filter(r => shouldBeSelfAssignable(r))
      .map(r =>
        {
          let role = new Role();
          role.name = r.name.replace("@", "");
          role.id = r.id;
          role.category = uncat_SA;
          return role;
        })

    let roles_NonSA = guild.roles.cache.filter(r => !shouldBeSelfAssignable(r))
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
  }
})

client.on("roleCreate", async (roleCreated) =>
{
  let uncat = await getRepository(Category)
    .findOne({
      name: "Uncategorized",
      guild: {
        id: roleCreated.guild.id,
      }
    });

  if (!uncat)
  {
    console.error(`${roleCreated.guild.name} has not been setup properly.`);
    return;
  }

  let checkRoles = uncat.roles.filter(role => role.name === roleCreated.name);
  if (checkRoles.length > 0)
  {
    roleCreated = await roleCreated.delete("An uncategorized role with the same name already exists");
    return;
  }
  
  let dbRole = new Role();
  dbRole.id = roleCreated.id;
  dbRole.name = roleCreated.name;

  dbRole.category = uncat;
  uncat.roles = [...uncat.roles, dbRole];

  await getRepository(Role).save(dbRole);
  await getRepository(Category).save(uncat);


})

client.on("roleDelete", async (roleDeleted) =>
{
  let dbGuild = await getRepository(Guild)
    .findOne(roleDeleted.guild.id);

  for (const cat of dbGuild.categories)
  {
    for (const role of cat.roles)
    {
      if (role.id === roleDeleted.id)
      {
        await getRepository(Role).remove(role);
        return;
      }
    }
  }
})

client.on("roleUpdate", async (oldRole, newRole) =>
{
  let dbGuild = await getRepository(Guild)
    .findOne(oldRole.guild.id);

  for (const cat of dbGuild.categories)
  {
    for (const role of cat.roles)
    {
      if (role.id === oldRole.id)
      {
        role.name = newRole.name;
        await getRepository(Role).save(role);
        return;
      }
    }
  }
})

client.on("error", console.error);

client.login(process.env.TOKEN);

export {
  shouldBeSelfAssignable
}