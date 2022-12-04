import fs from "fs";
import path from "path";

const commandsFolder = path.resolve(process.cwd(), `src/core/commands`);

const commandNames = fs
  .readdirSync(commandsFolder)
  .filter((it) => !["commandTypes.d.ts", "index.ts"].includes(it))
  .map((it) => it.replace(/\.ts$/, ""));

const indexOutput = `// @generated
// This file was automatically generated and should not be edited.
// Try running \`npm run gen:command\` instead.

import Command from './commandTypes';
${commandNames.map((it) => `import ${it}Command from './${it}';`).join("\n")}

export type commandName = 
${commandNames.map((it) => ` | '${it}'`).join("\n")}

const commands: Record<commandName, Command> = {
${commandNames.map((it) => `  ${it}: ${it}Command,`).join("\n")}
};

export default commands;
`;

const indexFilePath = path.join(commandsFolder, "/index.ts");

fs.writeFileSync(indexFilePath, indexOutput);
