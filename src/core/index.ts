import { type ClientEvents, Client, GatewayIntentBits } from 'discord.js';
import events from './events';
import logError from './logError';
import { getEnvRequired } from './getEnv';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

for (const eventHandlerName in events) {
  if (Object.prototype.hasOwnProperty.call(events, eventHandlerName)) {
    const eventHandler = events[eventHandlerName as keyof ClientEvents];
    if (!eventHandler) continue;
    if (eventHandler.once) {
      client.once(eventHandlerName, async (...args) => {
        try {
          await eventHandler.execute(...args);
        } catch (error) {
          await logError(error);
        }
      });
    } else {
      client.on(eventHandlerName, async (...args) => {
        try {
          await eventHandler.execute(...args);
        } catch (error) {
          await logError(error);
        }
      });
    }
  }
}

if (import.meta.main) {
  await client.login(getEnvRequired('CLIENT_TOKEN'));
  console.log('Started client');
}
