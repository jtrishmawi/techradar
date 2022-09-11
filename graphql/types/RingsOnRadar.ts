import { objectType } from "nexus";
import { RingsOnRadar as RingsOnRadarModel } from "nexus-prisma";

export const RingsOnRadar = objectType({
  name: RingsOnRadarModel.$name,
  description: RingsOnRadarModel.$description,
  definition: (t) => {
    t.field(RingsOnRadarModel.ring);
    t.field(RingsOnRadarModel.ringId);
    t.field(RingsOnRadarModel.radar);
    t.field(RingsOnRadarModel.radarId);
    t.field(RingsOnRadarModel.assignedAt);
  },
});
