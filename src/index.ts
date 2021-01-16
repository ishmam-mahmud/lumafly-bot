import { CommandoClient } from "discord.js-commando";
import path from "path";
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { Category } from "./entity/Category"
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

  let uncat = await getRepository(Category)
    .findOne({
      name: "Uncategorized",
    });

  if (!uncat)
  {
    uncat = new Category();
    uncat.name = "Uncategorized";
    uncat.roles = [];
    uncat.selfAssignable = false;
    getRepository(Category).save(uncat);
  }
})

client.on("guildCreate", async guild =>
{
  let uncat = await getRepository(Category)
    .findOne({
      name: "Uncategorized",
    });

  uncat.roles = [];

  let roles = guild.roles.cache.map(r =>
    {
      let role = new Role();
      role.category = uncat;
      role.color = r.hexColor;
      role.name = r.name;
      role.id = r.id;
      return role;
    });

  await getRepository(Role).save(roles);

  uncat.roles = [...uncat.roles, ...roles];

  await getRepository(Category).save(uncat);
})

client.on("error", console.error);

client.login(process.env.TOKEN);