import { Client, Intents } from 'discord.js';
import getEnv from './getEnv';

const discordClient = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

discordClient.login(getEnv('CLIENT_TOKEN'));

export default discordClient;
