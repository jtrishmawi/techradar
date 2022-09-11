import { extendType, objectType } from "nexus";
import { Blip as BlipModel } from "nexus-prisma";

export const Blip = objectType({
  name: BlipModel.$name,
  description: BlipModel.$description,
  definition: (t) => {
    t.field(BlipModel.id);
    t.field(BlipModel.name);
    t.field(BlipModel.description);
    t.field(BlipModel.createdAt);
    t.field(BlipModel.updatedAt);
    t.field(BlipModel.assignedBlips)
  },
});


export const BlipQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.field("blips", {
      type: BlipModel.$name,
      resolve: (_parent, _args, ctx) => ctx.prisma.blip.findMany(),
    });
  },
});
