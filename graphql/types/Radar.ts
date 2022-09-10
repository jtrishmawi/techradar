import { extendType, objectType } from "nexus";
import { Radar as RadarModel } from "nexus-prisma";

export const Radar = objectType({
  name: RadarModel.$name,
  description: RadarModel.$description,
  definition: (t) => {
    t.field(RadarModel.id);
    t.field(RadarModel.name);
    t.field(RadarModel.quadrants);
    t.field(RadarModel.rings);
    t.field(RadarModel.createdAt);
    t.field(RadarModel.updatedAt);
  },
});

export const RadarQueries = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.field("radars", {
      type: RadarModel.$name,
      resolve: (_parent, _args, ctx) => ctx.prisma.radar.findMany(),
    });
  },
});
