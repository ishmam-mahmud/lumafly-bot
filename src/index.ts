import { ClientEvents } from "discord.js";
import discordClient from "./core/client";
import events from "./core/events";
import logError from "./core/logError";

for (const eventHandlerName in events) {
  if (Object.prototype.hasOwnProperty.call(events, eventHandlerName)) {
    const eventHandler = events[eventHandlerName as keyof ClientEvents];
    if (!eventHandler) continue;
    if (eventHandler.once) {
      discordClient.once(eventHandlerName, async (...args) => {
        try {
          await eventHandler.execute(...args);
        } catch (error) {
          logError(error);
        }
      });
    } else {
      discordClient.on(eventHandlerName, async (...args) => {
        try {
          await eventHandler.execute(...args);
        } catch (error) {
          logError(error);
        }
      });
    }
  }
}

console.log("Started client");
