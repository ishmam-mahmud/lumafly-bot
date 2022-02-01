import { config } from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const cwd = process.cwd();
const pathToBaseEnv = path.resolve(cwd, '.env.base');
dotenvExpand(
  config({
    path: pathToBaseEnv,
  })
);

const matcher = /(\${?)(\w+)(}?)/g;

(async () => {
  const baseEnv = await readFile(pathToBaseEnv, { encoding: 'utf-8' });

  const outputString = baseEnv.replace(matcher, (...args) => {
    const key = args[2];
    let value = process.env[key];
    if (!value) {
      console.error(`Env ${key} not defined`);
      value = '';
    }
    return value;
  });

  await writeFile(path.resolve(cwd, '.env'), outputString);
})();
