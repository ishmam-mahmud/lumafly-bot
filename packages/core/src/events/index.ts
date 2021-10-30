// @generated
// This file was automatically generated and should not be edited.
// Try running `npm run gen:event` instead.

import { ClientEvents } from 'discord.js';
import Event from './eventTypes';
import interactionCreateEventHandler from './interactionCreate';
import readyEventHandler from './ready';

const events: Partial<Record<keyof ClientEvents, Event<any>>> = {
  interactionCreate: interactionCreateEventHandler,
  ready: readyEventHandler,
};

export default events;
