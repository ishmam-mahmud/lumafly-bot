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

  // let uncat = await getRepository(Category)
  //   .findOne({
  //     name: "Uncategorized",
  //   });

  // if (!uncat)
  // {
  //   uncat = new Category();
  //   uncat.name = "Uncategorized";
  //   uncat.roles = [];
  //   uncat.selfAssignable = false;
  //   getRepository(Category).save(uncat);
  // }
})

client.on("guildCreate", async guild =>
{
  let dbGuild = await getRepository(Guild)
    .findOne(guild.id)
  
  if (!dbGuild) {
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

client.on("roleCreate", async (roleCreated) => {
  let dbRole = new Role();
  dbRole.id = roleCreated.id;
  dbRole.name = roleCreated.name;

  let uncat = await getRepository(Category)
    .findOne({
      name: "Uncategorized",
      guild: {
        id: roleCreated.guild.id,
      }
    });

  dbRole.category = uncat;
  uncat.roles = [...uncat.roles, dbRole];

  await getRepository(Category).save(uncat);
  await getRepository(Role).save(dbRole);
})

client.on("roleDelete", async (roleDeleted) => {
  let dbRole = await getRepository(Role)
    .findOne({
      name: roleDeleted.name,
      id: roleDeleted.id,
      category: {
        guild: {
          id: roleDeleted.guild.id,
          name: roleDeleted.guild.name,
        },
      },
    });
  
  let uncat = await getRepository(Category)
    .findOne({
      name: "Uncategorized",
      guild: {
        id: roleDeleted.guild.id,
      }
    });

  uncat.roles = uncat.roles.filter(r => r.id === roleDeleted.id);

  await getRepository(Category).save(uncat);
  await getRepository(Role).remove(dbRole);
})

client.on("roleUpdate", async (oldRole, newRole) =>
{
  let dbRole = await getRepository(Role)
    .findOne({
      name: oldRole.name,
      id: oldRole.id,
      category: {
        guild: {
          id: oldRole.guild.id,
          name: oldRole.guild.name,
        },
      },
    });
  
  dbRole.name = newRole.name;
  dbRole.id = newRole.id;

  await getRepository(Role).save(dbRole);
})

client.on("error", console.error);

client.login(process.env.TOKEN);