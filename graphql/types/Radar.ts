import { extendType, objectType, stringArg } from "nexus";
import { Blip, Radar as RadarModel } from "nexus-prisma";

export const Radar = objectType({
  name: RadarModel.$name,
  description: RadarModel.$description,
  definition: (t) => {
    t.field(RadarModel.id);
    t.field(RadarModel.name);
    t.field(RadarModel.slug);
    t.field(RadarModel.order);
    t.field(RadarModel.quadrants);
    t.field(RadarModel.rings);
    t.field(RadarModel.createdAt);
    t.field(RadarModel.updatedAt);
  },
});

export const RadarQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.field("radars", {
      type: RadarModel.$name,
      resolve: (_parent, _args, ctx) =>
        ctx.prisma.radar.findMany({
          orderBy: [{ order: "desc" }],
        }),
    });
    t.list.field("radar_with_blips", {
      type: Blip.$name,
      args: {
        slug: stringArg({ description: "Radar's slug" }),
      },
      resolve: async (_parent, { slug }, ctx) => {
        if (!slug) return null;
        const result = await ctx.prisma.radar.findUnique({
          where: { slug },
          include: {
            quadrants: {
              include: {
                quadrant: {
                  include: {
                    assignedBlips: {
                      include: { blip: true },
                    },
                  },
                },
              },
              orderBy: [{ quadrant: { order: "desc" } }],
            },
          },
        });

        return (
          result?.quadrants.flatMap((group) =>
            group.quadrant.assignedBlips.map((assignment) => assignment.blip)
          ) || []
        );
      },
    });
  },
});
