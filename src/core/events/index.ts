// @generated
// This file was automatically generated and should not be edited.
// Try running `npm run gen:event` instead.

import { Events } from "discord.js";
import Event from "./eventTypes";
import debugEventHandler from "./debug";
import errorEventHandler from "./error";
import interactionCreateEventHandler from "./interactionCreate";
import messageCreateEventHandler from "./messageCreate";
import messageReactionAddEventHandler from "./messageReactionAdd";
import readyEventHandler from "./ready";
import roleCreateEventHandler from "./roleCreate";
import roleDeleteEventHandler from "./roleDelete";
import roleUpdateEventHandler from "./roleUpdate";
import threadUpdateEventHandler from "./threadUpdate";

const events: Partial<Record<Events, Event<any>>> = {
  [Events.Debug]: debugEventHandler,
  [Events.Error]: errorEventHandler,
  [Events.InteractionCreate]: interactionCreateEventHandler,
  [Events.MessageCreate]: messageCreateEventHandler,
  [Events.MessageReactionAdd]: messageReactionAddEventHandler,
  [Events.ClientReady]: readyEventHandler,
  [Events.GuildRoleCreate]: roleCreateEventHandler,
  [Events.GuildRoleDelete]: roleDeleteEventHandler,
  [Events.GuildRoleUpdate]: roleUpdateEventHandler,
  [Events.ThreadUpdate]: threadUpdateEventHandler,
};

export default events;
