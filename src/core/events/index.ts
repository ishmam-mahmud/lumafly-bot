// @generated
// This file was automatically generated and should not be edited.
// Try running `npm run gen:event` instead.

import { ClientEvents } from 'discord.js';
import Event from './eventTypes';
import errorEventHandler from './error';
import guildCreateEventHandler from './guildCreate';
import guildDeleteEventHandler from './guildDelete';
import interactionCreateEventHandler from './interactionCreate';
import messageCreateEventHandler from './messageCreate';
import readyEventHandler from './ready';
import roleCreateEventHandler from './roleCreate';
import roleDeleteEventHandler from './roleDelete';
import roleUpdateEventHandler from './roleUpdate';

const events: Partial<Record<keyof ClientEvents, Event<any>>> = {
  error: errorEventHandler,
  guildCreate: guildCreateEventHandler,
  guildDelete: guildDeleteEventHandler,
  interactionCreate: interactionCreateEventHandler,
  messageCreate: messageCreateEventHandler,
  ready: readyEventHandler,
  roleCreate: roleCreateEventHandler,
  roleDelete: roleDeleteEventHandler,
  roleUpdate: roleUpdateEventHandler,
};

export default events;
