import Command from './commandTypes';
import PingCommand from './ping';

type commandName = 'ping';

const commands: Record<commandName, Command> = {
  ping: PingCommand,
};

export default commands;
