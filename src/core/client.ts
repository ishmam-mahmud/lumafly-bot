import { Client, GatewayIntentBits } from 'discord.js';
import getEnv from './getEnv';

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

discordClient.login(getEnv('CLIENT_TOKEN'));

export default discordClient;
