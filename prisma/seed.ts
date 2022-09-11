import { PrismaClient } from "@prisma/client";

const radarsSeed = [
  {
    name: "Frontend",
    slug: "frontend",
  },
  {
    name: "Node",
    slug: "node",
  },
  {
    name: "PHP",
    slug: "php",
  },
  {
    name: "Java",
    slug: "java",
  },
  {
    name: "Mobile",
    slug: "mobile",
  },
  {
    name: "Blockchain",
    slug: "blockchain",
  },
];

const quadrantsSeed = [
  { name: "QUADRANT A" },
  { name: "QUADRANT B" },
  { name: "QUADRANT C" },
  { name: "QUADRANT D" },
];

const ringsSeed = [
  { name: "ADOPT" },
  { name: "ASSESS" },
  { name: "TRIAL" },
  { name: "HOLD" },
];

const blipsSeed = Array.from(
  { length: radarsSeed.length * quadrantsSeed.length * ringsSeed.length },
  (_, i) => ({
    name: `blip #${i + 1}`,
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non placeat nemo delectus vel minima excepturi hic nesciunt nihil sequi omnis animi ad fugit natus, iure maxime magni maiores quae quos?",
  })
);

const prisma = new PrismaClient();

async function main() {
  const radarQueries = radarsSeed.map((radar, i) =>
    prisma.radar.create({
      include: {
        quadrants: {
          include: {
            quadrant: true,
          },
        },
        rings: {
          include: {
            ring: true,
          },
        },
      },
      data: {
        ...radar,
        order: i,
        quadrants: {
          create: quadrantsSeed.map((quadrant, i) => ({
            quadrant: {
              create: { ...quadrant, order: i },
            },
          })),
        },
        rings: {
          create: ringsSeed.map((ring, i) => ({
            ring: { create: { ...ring, order: i } },
          })),
        },
      },
    })
  );
  const radars = await prisma.$transaction(radarQueries);

  const blipQueries = radars.flatMap((radar, i) => {
    return radar.quadrants.flatMap(({ quadrant }, iq, { length: lengthq }) => {
      return radar.rings.map(({ ring }, ir, { length: lengthr }) => {
        return prisma.assignedBlips.create({
          data: {
            quadrant: { connect: { id: quadrant.id } },
            ring: { connect: { id: ring.id } },
            blip: {
              create: blipsSeed[i * (lengthr * lengthq) + iq * lengthq + ir],
            },
          },
        });
      });
    });
  });

  await prisma.$transaction(blipQueries);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
