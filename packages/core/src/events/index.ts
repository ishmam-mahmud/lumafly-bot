import { Collection } from 'discord.js';
import Event from './eventTypes';
import ReadyEvent from './ready';
import InteractionCreateEvent from './interactionCreate';

const events = new Collection<string, Event<any>>();

events.set(ReadyEvent.name, ReadyEvent);
events.set(InteractionCreateEvent.name, InteractionCreateEvent);

export default events;
