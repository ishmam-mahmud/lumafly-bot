import fs from 'fs';
import path from 'path';

const eventHandlersDir = path.resolve(process.cwd(), `src/events`);

const eventNames = fs
  .readdirSync(eventHandlersDir)
  .filter((it) => !['eventTypes.d.ts', 'index.ts'].includes(it))
  .map((it) => it.replace(/\.ts$/, ''));

const indexOutput = `// @generated
// This file was automatically generated and should not be edited.
// Try running \`npm run gen:event\` instead.

import { ClientEvents } from 'discord.js';
import Event from './eventTypes';
${eventNames.map((it) => `import ${it}EventHandler from './${it}';`).join('\n')}

const events: Partial<Record<keyof ClientEvents, Event<any>>> = {
${eventNames.map((it) => `  ${it}: ${it}EventHandler,`).join('\n')}
};

export default events;
`;

const indexFilePath = path.join(eventHandlersDir, '/index.ts');

fs.writeFileSync(indexFilePath, indexOutput);
