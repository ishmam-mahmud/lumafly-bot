import { config } from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { writeFile, readFile } from 'fs/promises';
import { resolve } from 'path';

dotenvExpand(config());

const matcher = /(\${?)(\w+)(}?)/g;

(async () => {
  const baseEnv = await readFile(resolve(process.cwd(), '.env.base'), { encoding: 'utf-8' });

  const outputString = baseEnv.replace(matcher, (...args) => {
    const key = args[2];
    let value = process.env[key];
    if (!value) value = '';
    return value;
  });

  await writeFile(resolve(process.cwd(), '.env'), outputString);
})();
