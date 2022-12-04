import Event from "./eventTypes";

const readyEvent: Event<"ready"> = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Client Ready. Logged in as ${client.user?.tag}`);
  },
};

export default readyEvent;
