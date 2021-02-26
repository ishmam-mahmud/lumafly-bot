import { CommandoClient } from "discord.js-commando";
import path from "path";
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { Category } from "./entity/Category"
import { Guild } from "./entity/Guild"
import { Role } from "./entity/Role"
import { setupCats, logError, logErrorFromMsg } from "./utils";
import logger from "./log";
import * as entities from './entity';
import dotenv from "dotenv"

dotenv.config();

const client = new CommandoClient({
  commandPrefix: process.env.PREFIX,
  owner: process.env.OWNER,
  presence: {
    status: "online",
  },
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["admin", "Admin Commands"],
    ["category", "Role Category Commands"],
    ["member", "Member Commands"],
    ["owner", "Owner Commands"],
    ["setting", "Settings Commands"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    unknownCommand: false,
  })
  .registerCommandsIn(path.join(__dirname, "commands"))

client.once("ready", async () =>
{
  console.log(`Logged in as ${client.user?.tag}. (${client.user?.id})`);

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
        logging: "all",
        logger: "file",
        entities: Object.keys(entities).map((name: string) => entities[name]),
        subscribers: [],
      });
      console.log("Connected to database");
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
  if (retries === 0)
  {
    await logError(Error("Failed to connect to db"), client);
    process.exit();
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
  try
  {
    let uncat = await getRepository(Category)
      .createQueryBuilder("cat")
      .innerJoin("cat.guild", "guild")
      .innerJoinAndSelect("cat.roles", "role")
      .where("cat.name = :name", { name: "Uncategorized" })
      .andWhere("guild.id = :id", { id: roleCreated.guild.id })
      .getOne();
  
    if (!uncat)
    {
      logger.error(`${roleCreated.guild.name} has not been setup properly.`);
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
  
    await getRepository(Role)
      .createQueryBuilder("role")
      .insert()
      .values([dbRole])
      .execute();

    await getRepository(Category)
      .createQueryBuilder("cat")
      .relation("roles")
      .of(uncat.id)
      .add(dbRole.id);
  } catch (error)
  {
    await logError(error, client);
  }
})

client.on("roleDelete", async (roleDeleted) =>
{
  try
  {
    let role = await getRepository(Role)
      .createQueryBuilder("role")
      .innerJoin("role.category", "cat")
      .innerJoin("cat.guild", "guild")
      .where("role.id = :roleId", { roleId: roleDeleted.id })
      .andWhere("guild.id = :id", { id: roleDeleted.guild.id })
      .getOne();

    await getRepository(Role)
      .createQueryBuilder("role")
      .delete()
      .where("role.id = :id", { id: role.id })
      .execute();
  } catch (error)
  {
    await logError(error, client);  
  }
})

client.on("roleUpdate", async (oldRole, newRole) =>
{
  try
  {
    if (oldRole.id === newRole.id && oldRole.name === newRole.name)
      return;

    await getRepository(Role)
      .createQueryBuilder("role")
      .update()
      .set({ name: newRole.name })
      .where("id = :id", { id: newRole.id })
      .execute();
  } catch (error)
  {
    await logError(error, client);
  }
})

client.on("message", async msg =>
{
  try
  {
    // Do nothing if bot's own message.
    if (msg.author.id === client.user.id)
      return;
    // Handle guild and dms differently
    if (msg.guild)
    {
      let dbGuild = await getRepository(Guild)
        .createQueryBuilder("guild")
        .where("guild.id = :id", { id: msg.guild?.id})
        .getOne();
  
      if (dbGuild)
      {
        let channelSuggestionsID = dbGuild.config.suggestionsChannelID;
        if (msg.channel.id === channelSuggestionsID)
        {
          let reactions = [msg.react("👍"), msg.react("👎")];
          await Promise.all(reactions);
        }
      }
    }
  } catch (error)
  {
    await logErrorFromMsg(error, msg);
  }
})

client.on("error", async err =>
{
  await logError(err, client);
});

client.login(process.env.TOKEN);