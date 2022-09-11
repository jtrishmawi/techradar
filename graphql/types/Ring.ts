import { objectType } from "nexus";
import { Ring as RingModel } from "nexus-prisma";

export const Ring = objectType({
  name: RingModel.$name,
  description: RingModel.$description,
  definition: (t) => {
    t.field(RingModel.id);
    t.field(RingModel.name);
    t.field(RingModel.order);
    t.field(RingModel.createdAt);
    t.field(RingModel.updatedAt);
    t.field(RingModel.assignedBlips);
  },
});
