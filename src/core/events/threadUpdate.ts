import Event from './eventTypes';

const threadUpdateEvent: Event<'threadUpdate'> = {
  name: 'threadUpdate',
  once: false,
  async execute(oldThread, newThread) {
    console.log(
      `Thread ${newThread.id} in Channel ${newThread.parentId} in Guild ${newThread.guildId} was updated`
    );
    if (newThread.archived) {
      console.log(
        `Thread ${newThread.id} in Channel ${newThread.parentId} in Guild ${newThread.guildId} is archived`
      );
      newThread.setArchived(false);
      console.log(
        `Unarchived Thread ${newThread.id} in Channel ${newThread.parentId} in Guild ${newThread.guildId}`
      );
    }
  },
};

export default threadUpdateEvent;
