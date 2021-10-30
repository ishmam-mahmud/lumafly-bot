// @generated
// This file was automatically generated and should not be edited.
// Try running `npm run gen:command` instead.

import Command from './commandTypes';
import pingCommand from './ping';

export type commandName = 'ping';

const commands: Record<commandName, Command> = {
  ping: pingCommand,
};

export default commands;
