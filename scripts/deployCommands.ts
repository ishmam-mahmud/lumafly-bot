import { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import Command from '../src/core/commands/commandTypes';
import commands, { commandName } from '../src/core/commands/index';
import getEnv from '../src/core/getEnv';

function getSlashCommandBuilder(command: Command) {
  if (command.type !== 'CHAT_INPUT') {
    throw new Error(`Invalid command type: ${JSON.stringify(command)}
    Expected command type CHAT_INPUT`);
  }
  const builder = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description);
  for (const option of command.options) {
    // TODO: Support other option types as they come along
    if (option.type === 'ROLE') {
      builder.addRoleOption((roleOption) =>
        roleOption
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(option.required)
      );
    }
  }
  return builder;
}

function getContextMenuCommandBuilder(command: Command) {
  let commandType: number;
  if (command.type === 'MESSAGE') commandType = 3;
  else if (command.type === 'USER') commandType = 2;
  else throw new Error(`Invalid command ${{ command }}`);

  const builder = new ContextMenuCommandBuilder()
    .setName(command.name)
    .setType(commandType)
    .setDefaultPermission(true);
  return builder;
}

const commandsJson = [];

for (const commandName in commands) {
  if (Object.prototype.hasOwnProperty.call(commands, commandName)) {
    const command = commands[commandName as commandName];
    if (!command.type || command.type === 'CHAT_INPUT') {
      commandsJson.push(getSlashCommandBuilder(command).toJSON());
    } else {
      commandsJson.push(getContextMenuCommandBuilder(command).toJSON());
    }
  }
}

const rest = new REST({ version: '9' }).setToken(getEnv('CLIENT_TOKEN'));

(async () => {
  await rest.put(Routes.applicationGuildCommands(getEnv('CLIENT_ID'), getEnv('GUILD_ID')), {
    body: commandsJson,
  });
  console.log('Successfully registered application commands.');
})();
