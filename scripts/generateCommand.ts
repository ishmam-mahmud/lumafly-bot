import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const flags = new Set<string>();

for (const flag of process.argv) {
  if (flag === '--force') flags.add('force');
}

const commandTemplateString = fs.readFileSync(
  path.resolve(process.cwd(), 'scripts/command.ts.hbs'),
  {
    encoding: 'utf-8',
  },
);

const template = Handlebars.compile(commandTemplateString);

const commandName = process.argv[2];
if (!commandName || commandName === '') {
  console.error('Invalid command name');
  process.exit();
}

const commandTemplateProps = {
  name: commandName,
};

const output = template(commandTemplateProps);

const commandPath = path.join(
  path.resolve(process.cwd(), `src/core/commands`),
  `/${commandName}.ts`,
);

if (fs.existsSync(commandPath) && !flags.has('force')) {
  console.log(`Command file already exists at ${commandPath}`);
  process.exit();
}

fs.writeFileSync(commandPath, output);
