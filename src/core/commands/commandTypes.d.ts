import { CommandInteraction } from 'discord.js';

type CommandOptionType = 'ROLE';
export interface CommandOption {
  type: CommandOptionType;
  name: string;
  description: string;
  required: boolean;
}
export default interface Command {
  name: string;
  description: string;
  execute: (interaction: CommandInteraction<'cached'>) => Promise<any>;
  options: CommandOption[];
}
