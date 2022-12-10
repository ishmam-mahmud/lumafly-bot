import Event from "./eventTypes";

const debugEvent: Event<"debug"> = {
  name: "debug",
  once: false,
  async execute(debug) {
    console.log(debug)
  },
};

export default debugEvent;
