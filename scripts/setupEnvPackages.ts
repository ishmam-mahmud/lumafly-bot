import { config } from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { writeFile, readFile, readdir } from 'fs/promises';
import { resolve } from 'path';

dotenvExpand(config());

const matcher = /(\${?)(\w+)(}?)/g;

(async () => {
  const baseEnv = await readFile(resolve(process.cwd(), '.env'), { encoding: 'utf-8' });

  const outputString = baseEnv.replace(matcher, (...args) => {
    const key = args[2];
    const value = process.env[key];
    if (!value) {
      throw `Env ${key} not defined`;
    }
    return value;
  });
  const packages = await readdir(resolve(process.cwd(), 'packages'));

  await Promise.all([
    packages.map((it) => writeFile(resolve(process.cwd(), `packages/${it}/.env`), outputString)),
  ]);
})();
