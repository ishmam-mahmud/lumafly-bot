import { CacheType, CommandInteraction } from 'discord.js';

export default interface Command {
  name: string;
  description: string;
  execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
}
