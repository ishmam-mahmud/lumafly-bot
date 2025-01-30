import { Client, GatewayIntentBits } from 'discord.js';
import {getEnvRequired} from './getEnv';

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

discordClient.login(getEnvRequired('CLIENT_TOKEN'));

export default discordClient;
