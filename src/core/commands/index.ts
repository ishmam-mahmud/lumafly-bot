// @generated
// This file was automatically generated and should not be edited.
// Try running `npm run gen:command` instead.

import Command from './commandTypes';
import deroleCommand from './derole';
// import dumpCommand from './dump';
import roleCommand from './role';
import rolesCommand from './roles';
import setupCommand from './setup';

export type commandName = 'derole' | 'role' | 'roles' | 'setup';

const commands: Record<commandName, Command> = {
  derole: deroleCommand,
  // dump: dumpCommand,
  role: roleCommand,
  roles: rolesCommand,
  setup: setupCommand,
};

export default commands;
