import { objectType } from "nexus";
import { AssignedBlips as AssignedBlipsModel } from "nexus-prisma";

export const AssignedBlips = objectType({
  name: AssignedBlipsModel.$name,
  description: AssignedBlipsModel.$description,
  definition: (t) => {
    t.field(AssignedBlipsModel.blip)
    t.field(AssignedBlipsModel.quadrant)
    t.field(AssignedBlipsModel.ring)
    t.field(AssignedBlipsModel.assignedAt)
  },
});
