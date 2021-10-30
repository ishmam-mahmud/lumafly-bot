import Event from './eventTypes';

const ReadyEvent: Event<'ready'> = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Client Ready. Logged in as ${client.user?.tag}`);
  },
};

export default ReadyEvent;
