import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import Command from '../src/core/commands/commandTypes';
import commands, { commandName } from '../src/core/commands/index';
import getEnv from '../src/core/getEnv';

function getSlashCommandBuilder(command: Command) {
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

const commandsJson = [];

for (const commandName in commands) {
  if (Object.prototype.hasOwnProperty.call(commands, commandName)) {
    const command = commands[commandName as commandName];
    commandsJson.push(getSlashCommandBuilder(command).toJSON());
  }
}

const rest = new REST({ version: '9' }).setToken(getEnv('CLIENT_TOKEN'));

(async () => {
  await rest.put(Routes.applicationGuildCommands(getEnv('CLIENT_ID'), getEnv('GUILD_ID')), {
    body: commandsJson,
  });
  console.log('Successfully registered application commands.');
})();
