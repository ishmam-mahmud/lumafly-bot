import discordClient from './client';
import events from './events';

events.forEach((it) => {
  if (it.once) {
    discordClient.once(it.name, (...args) => it.execute(...args));
  } else {
    discordClient.on(it.name, (...args) => it.execute(...args));
  }
});

console.log('Started client');
