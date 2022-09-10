import {
  SlashCommandBuilder,
  Routes,
  ContextMenuCommandBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord.js';
import { REST } from '@discordjs/rest';
import {
  ChatInputCommandInteractionHandler,
  ContextMenuCommandInteractionHandler,
} from './commands/commandTypes';
import commands, { commandName } from './commands/index';
import getEnv from './getEnv';

function getSlashCommandBuilder(command: ChatInputCommandInteractionHandler) {
  const builder = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description);
  for (const option of command.options) {
    // TODO: Support other option types as they come along
    if (option.type === ApplicationCommandOptionType.Role) {
      builder.addRoleOption((roleOption) =>
        roleOption
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(option.required ?? false)
      );
    }
  }
  return builder;
}

function getContextMenuCommandBuilder(
  command: ContextMenuCommandInteractionHandler
) {
  if (
    command.type !== ApplicationCommandType.Message &&
    command.type !== ApplicationCommandType.User
  )
    throw `Invalid command ${command}`;
  const builder = new ContextMenuCommandBuilder()
    .setName(command.name)
    .setType(command.type)
    .setDefaultMemberPermissions(1);
  return builder;
}

export async function deployCommands() {
  const commandsJson = [];

  for (const commandName in commands) {
    if (Object.prototype.hasOwnProperty.call(commands, commandName)) {
      const command = commands[commandName as commandName];
      if (command.type === ApplicationCommandType.ChatInput) {
        commandsJson.push(getSlashCommandBuilder(command).toJSON());
      } else {
        commandsJson.push(getContextMenuCommandBuilder(command).toJSON());
      }
    }
  }

  const rest = new REST({ version: '10' }).setToken(getEnv('CLIENT_TOKEN'));

  await rest.put(
    Routes.applicationGuildCommands(getEnv('CLIENT_ID'), getEnv('GUILD_ID')),
    {
      body: commandsJson,
    }
  );
  console.log('Successfully registered application commands.');
  process.exit();
}
