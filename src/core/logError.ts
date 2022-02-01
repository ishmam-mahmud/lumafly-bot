import discordClient from './client';
import getEnv from './getEnv';

export default async function logError(error: any) {
  const logMessage = `Timestamp ${new Date().toISOString()}: ${JSON.stringify(
    error
  )}`;
  console.error(logMessage);
  console.error(error);
  const owner = await discordClient.users.fetch(getEnv('CLIENT_OWNER'));
  await owner?.send(logMessage);
}
