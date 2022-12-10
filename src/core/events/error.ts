import Event from "./eventTypes";

const errorEvent: Event<"error"> = {
  name: "error",
  once: false,
  async execute(error) {
    throw error;
  },
};

export default errorEvent;
