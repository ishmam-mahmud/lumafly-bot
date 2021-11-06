import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const flags = new Set<string>();

for (const flag of process.argv) {
  if (flag === '--force') flags.add('force');
}

const eventTemplateString = fs.readFileSync(path.resolve(process.cwd(), 'scripts/event.ts.hbs'), {
  encoding: 'utf-8',
});

const template = Handlebars.compile(eventTemplateString);

const eventName = process.argv[2];
if (!eventName || eventName === '') {
  console.error('Invalid event name');
  process.exit();
}

const eventTemplateProps = {
  name: eventName,
  Name: `${eventName[0].toUpperCase()}${eventName.slice(1)}`,
};

const output = template(eventTemplateProps);

const eventPath = path.join(path.resolve(process.cwd(), `src/core/events`), `/${eventName}.ts`);

if (fs.existsSync(eventPath) && !flags.has('force')) {
  console.log(`Event Handler file already exists at ${eventPath}`);
  process.exit();
}

fs.writeFileSync(eventPath, output);
