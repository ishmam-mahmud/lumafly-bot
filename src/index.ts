import { CommandoClient } from "discord.js-commando";
import path from "path";
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { Category } from "./entity/Category"
import { Guild } from "./entity/Guild"
import { Role } from "./entity/Role"
import { setupCats, logError } from "./utils";

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
  .registerDefaultCommands({
    unknownCommand: false,
  })
  .registerCommandsIn(path.join(__dirname, "commands"))

// if (client.registry.unknownCommand)
//   client.registry.unregisterCommand(client.registry.unknownCommand);

client.once("ready", async () =>
{
  console.log(`Logged in as ${client.user?.tag}. (${client.user?.id})`);
  await client.user?.setPresence({ activity: { name: "Hades" }, status: "online" });

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



client.on("guildCreate", async guild =>
{
  try
  {
    await setupCats(guild);
  } catch (error)
  {
    await logError(error, client);
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
  if (oldRole.id === newRole.id && oldRole.name === newRole.name)
    return;

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
  setupCats,
}