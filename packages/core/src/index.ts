import { ClientEvents } from 'discord.js';
import discordClient from './client';
import events from './events';

for (const eventHandlerName in events) {
  if (Object.prototype.hasOwnProperty.call(events, eventHandlerName)) {
    const eventHandler = events[eventHandlerName as keyof ClientEvents];
    if (!eventHandler) continue;
    if (eventHandler.once) {
      discordClient.once(eventHandlerName, (...args) => eventHandler.execute(...args));
    } else {
      discordClient.on(eventHandlerName, (...args) => eventHandler.execute(...args));
    }
  }
}

console.log('Started client');
