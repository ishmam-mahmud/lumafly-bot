// @generated
// This file was automatically generated and should not be edited.
// Try running `npm run gen:command` instead.

import Command from './commandTypes';
import deroleCommand from './derole';
import nvinfoCommand from './nvinfo';
import roleCommand from './role';
import rolesCommand from './roles';

export type commandName = 'derole' | 'nvinfo' | 'role' | 'roles';

const commands: Record<commandName, Command> = {
  derole: deroleCommand,
  nvinfo: nvinfoCommand,
  role: roleCommand,
  roles: rolesCommand,
};

export default commands;
