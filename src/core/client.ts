import { Client, Intents } from 'discord.js';
import getEnv from './getEnv';

const discordClient = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

discordClient.login(getEnv('CLIENT_TOKEN'));

export default discordClient;
