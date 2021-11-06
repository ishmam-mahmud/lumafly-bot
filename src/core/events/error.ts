import discordClient from '../client';
import getEnv from '../getEnv';
import Event from './eventTypes';

const ErrorEvent: Event<'error'> = {
  name: 'error',
  once: false,
  async execute(error) {
    const owner = await discordClient.users.cache.get(getEnv('CLIENT_OWNER'));
    console.log(error);
    owner?.send(error.message);
  },
};

export default ErrorEvent;
