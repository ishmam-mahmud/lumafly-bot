interface EnvObj {
  CLIENT_TOKEN: string;
  CLIENT_OWNER: string;
  CLIENT_ID: string;
  GUILD_ID: string;
  SENTRY_DSN: string;
}

type Env = keyof EnvObj;

export function getEnv(envVar: Env): string | null {
  const value = process.env[envVar];
  if (!value) {
    return null;
  }
  return value;
}

export function getEnvRequired(envVar: Env): string {
  const value = getEnv(envVar);
  if (!value) throw new Error(`${envVar} not found in environment`);
  return value;
}
