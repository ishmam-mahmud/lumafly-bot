import { CommandoClient } from "discord.js-commando";
import path from "path";
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { Category } from "./entity/Category"
import { Guild } from "./entity/Guild"
import { Role } from "./entity/Role"

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
  await client.user?.setPresence({ activity: { name: "Hades" }, status: "dnd" });

  await createConnection({
    type: "sqlite",
    database: "./test.sql",
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
})

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

    let uncat = new Category();
    uncat.name = "Uncategorized";
    uncat.guild = dbGuild;
    uncat.roles = [];
    uncat.selfAssignable = false;

    let roles = guild.roles.cache.map(r =>
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