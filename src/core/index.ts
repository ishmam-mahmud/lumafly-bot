import { ClientEvents } from 'discord.js';
import discordClient from './client';
import events from './events';
import logError from './logError';

for (const eventHandlerName in events) {
  if (Object.prototype.hasOwnProperty.call(events, eventHandlerName)) {
    const eventHandler = events[eventHandlerName as keyof ClientEvents];
    if (!eventHandler) continue;
    if (eventHandler.once) {
      discordClient.once(eventHandlerName, async (...args) => {
        try {
          await eventHandler.execute(...args);
        } catch (error) {
          await logError(error);
        }
      });
    } else {
      discordClient.on(eventHandlerName, async (...args) => {
        try {
          await eventHandler.execute(...args);
        } catch (error) {
          await logError(error);
        }
      });
    }
  }
}

console.log('Started client');
