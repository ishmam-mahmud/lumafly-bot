import { Client, GatewayIntentBits, Partials } from 'discord.js';
import getEnv from './getEnv';

const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
});

discordClient.login(getEnv('CLIENT_TOKEN'));

export default discordClient;
