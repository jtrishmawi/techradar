import { PrismaClient } from "@prisma/client";

const radars = [
  {
    name: "Front",
  },
  {
    name: "PHP",
  },
];

const prisma = new PrismaClient();

async function main() {
  return Promise.all(
    radars.map((radar) => prisma.radar.create({ data: radar }))
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
