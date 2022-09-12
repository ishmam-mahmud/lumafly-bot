import logError from '../logError';
import Event from './eventTypes';

const errorEvent: Event<'error'> = {
  name: 'error',
  once: false,
  async execute(error) {
    return await logError(error);
  },
};

export default errorEvent;
