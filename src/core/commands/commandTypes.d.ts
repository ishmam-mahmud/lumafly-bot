import {
  ApplicationCommandType,
  BaseCommandInteraction,
  CommandInteraction,
  ContextMenuInteraction,
} from 'discord.js';

type CommandOptionType = 'ROLE';
export interface CommandOption {
  type: CommandOptionType;
  name: string;
  description: string;
  required: boolean;
}

type Command =
  | {
      name: string;
      description: string;
      execute: (interaction: CommandInteraction<'cached'>) => Promise<any>;
      options: CommandOption[];
      type: 'CHAT_INPUT';
    }
  | {
      name: string;
      execute: (interaction: BaseCommandInteraction<'cached'>) => Promise<any>;
      type: 'USER' | 'MESSAGE';
    };

export default Command;
