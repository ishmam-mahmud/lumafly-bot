import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import Command from '../src/commands/commandTypes';
import commands from '../src/commands/index';
import getEnv from '../src/getEnv';

function getSlashCommandBuilder(command: Command) {
  return new SlashCommandBuilder().setName(command.name).setDescription(command.description);
}

const commandsJson = commands.map((it) => getSlashCommandBuilder(it).toJSON());
const rest = new REST({ version: '9' }).setToken(getEnv('CLIENT_TOKEN'));

(async () => {
  await rest.put(Routes.applicationGuildCommands(getEnv('CLIENT_ID'), getEnv('GUILD_ID')), {
    body: commandsJson,
  });
  console.log('Successfully registered application commands.');
})();
