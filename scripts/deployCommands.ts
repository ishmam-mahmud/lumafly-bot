import {
  type SlashCommandBuilder,
  type Routes,
  type ContextMenuCommandBuilder,
  type ApplicationCommandOptionType,
  type ApplicationCommandType,
} from 'discord.js';
import { type REST } from '@discordjs/rest';
import {
  ChatInputCommandInteractionHandler,
  type ContextMenuCommandInteractionHandler,
} from '../src/core/commands/commandTypes';
import commands, { type commandName } from '../src/core/commands/index';
import { getEnvRequired } from '../src/core/getEnv';

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
          .setRequired(option.required ?? false),
      );
    } else if (option.type === ApplicationCommandOptionType.User) {
      builder.addUserOption((userOption) =>
        userOption
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(option.required ?? false),
      );
    } else if (option.type === ApplicationCommandOptionType.Integer) {
      builder.addIntegerOption((integerOption) =>
        integerOption
          .setDescription(option.description)
          .setName(option.name)
          .setRequired(option.required ?? false),
      );
    }
  }
  return builder;
}

function getContextMenuCommandBuilder(
  command: ContextMenuCommandInteractionHandler,
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

(async () => {
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

  const rest = new REST({ version: '10' }).setToken(
    getEnvRequired('CLIENT_TOKEN'),
  );

  console.log(commandsJson);
  await rest.put(
    Routes.applicationGuildCommands(
      getEnvRequired('CLIENT_ID'),
      getEnvRequired('GUILD_ID'),
    ),
    {
      body: commandsJson,
    },
  );
  console.log('Successfully registered application commands.');
  process.exit();
})();
