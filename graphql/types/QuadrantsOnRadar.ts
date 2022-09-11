import { objectType } from "nexus";
import { QuadrantsOnRadar as QuadrantsOnRadarModel } from "nexus-prisma";

export const QuadrantsOnRadar = objectType({
  name: QuadrantsOnRadarModel.$name,
  description: QuadrantsOnRadarModel.$description,
  definition: (t) => {
    t.field(QuadrantsOnRadarModel.quadrant)
    t.field(QuadrantsOnRadarModel.quadrantId)
    t.field(QuadrantsOnRadarModel.radar)
    t.field(QuadrantsOnRadarModel.radarId)
    t.field(QuadrantsOnRadarModel.assignedAt)
  },
});
