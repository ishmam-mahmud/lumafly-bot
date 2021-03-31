import dotenv from "dotenv";
import { Client, TextChannel } from "discord.js";

dotenv.config();

const client = new Client();

client.once('ready', async () =>
{
  console.log('Ready!');
  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  if (channel.type === "text")
  {
    await (channel as TextChannel).send(process.env.MESSAGE);
  }
  process.exit();
});

client.login(process.env.TOKEN);
