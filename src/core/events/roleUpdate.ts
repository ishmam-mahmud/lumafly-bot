import dbClient from "../../db/client";
import Event from "./eventTypes";

const roleUpdateEvent: Event<"roleUpdate"> = {
  name: "roleUpdate",
  once: false,
  async execute(oldRole, newRole) {
    if (oldRole.name === newRole.name) {
      return;
    }

    const updatedRole = await dbClient.role.update({
      where: {
        id: newRole.id,
      },
      data: {
        name: newRole.name,
      },
      select: {
        id: true,
      },
    });

    console.log(
      `Role with id ${updatedRole.id} updated name from ${oldRole.name} to ${newRole.name}`
    );
  },
};

export default roleUpdateEvent;
