import { objectType } from "nexus";
import { Quadrant as QuadrantModel } from "nexus-prisma";

export const Quadrant = objectType({
  name: QuadrantModel.$name,
  description: QuadrantModel.$description,
  definition: (t) => {
    t.field(QuadrantModel.id)
    t.field(QuadrantModel.name)
    t.field(QuadrantModel.order)
    t.field(QuadrantModel.createdAt)
    t.field(QuadrantModel.updatedAt)
    t.field(QuadrantModel.assignedBlips)
  },
});
