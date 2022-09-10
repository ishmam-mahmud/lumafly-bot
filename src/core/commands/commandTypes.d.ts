import {
  ApplicationCommandOption,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  CommandInteraction,
  ContextMenuCommandInteraction,
} from 'discord.js';

interface BaseCommandHandler {
  type: ApplicationCommandType;
  name: string;
  description: string;
}

export interface ChatInputCommandInteractionHandler extends BaseCommandHandler {
  type: ApplicationCommandType.ChatInput;
  execute: (interaction: ChatInputCommandInteraction<'cached'>) => Promise<any>;
  options: ApplicationCommandOption[];
}

export interface ContextMenuCommandInteractionHandler
  extends BaseCommandHandler {
  type: ApplicationCommandType.User | ApplicationCommandType.Message;
  execute: (
    interaction: ContextMenuCommandInteraction<'cached'>
  ) => Promise<any>;
}

export type Command =
  | ChatInputCommandInteractionHandler
  | ContextMenuCommandInteractionHandler;

export default Command;
