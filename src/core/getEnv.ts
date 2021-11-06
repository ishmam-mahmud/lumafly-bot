import dotenv from 'dotenv';

dotenv.config();

interface EnvObj {
  CLIENT_TOKEN: string;
  CLIENT_OWNER: string;
  CLIENT_ID: string;
  GUILD_ID: string;
}

type Env = keyof EnvObj;

export default function getEnv(envVar: Env): string {
  const value = process.env[envVar];
  if (!value) throw new Error(`${envVar} not found in environment`);
  return value;
}
