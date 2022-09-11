import { gql } from "@apollo/client";
import { Quadrant, Radar, Ring } from "@prisma/client";
import TechRadar from "component/TechRadar";
import { apolloClient } from "lib/apollo";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

type Param = {
  params: {
    slug: string;
  };
};

const AllRadarsQuery = gql`
  query {
    radars {
      id
      name
      slug
      order
      createdAt
      updatedAt
    }
  }
`;

const AllBlipsQuery = gql`
  query AllRadarsQuery($slug: String) {
    radar_with_blips(slug: $slug) {
      id
      name
      description
      assignedBlips {
        quadrantId
        quadrant {
          name
          id
        }
        ring {
          name
          id
        }
        assignedAt
      }
    }
  }
`;

const Slug: NextPage<Props> = (props) => {
  return <TechRadar {...props} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await apolloClient.query<{
    radars: Radar[];
  }>({
    query: AllRadarsQuery,
  });

  const paths = (data?.radars || []).reduce<Param[]>(
    (prev, { slug }) => [
      ...prev,
      {
        params: { slug },
      } as Param,
    ],
    []
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data } = await apolloClient.query<{ radar_with_blips: any[] }>({
    query: AllBlipsQuery,
    variables: { slug: params?.slug },
  });

  const currentDate = new Date();
  currentDate.setHours(24, 0, 0, 0);
  currentDate.setMonth(currentDate.getMonth() - 1);
  const lastMonth = currentDate.getTime();

  const blips = data.radar_with_blips.map(
    ({ id, name, description, assignedBlips }) => {
      const date = new Date(assignedBlips[0].assignedAt);
      date.setHours(24, 0, 0, 0);
      return {
        id,
        name,
        description,
        quadrant: assignedBlips[0].quadrant,
        ring: assignedBlips[0].ring,
        isNew: lastMonth - date.getTime() <= 0,
      };
    }
  );

  const quadrants = Array.from(new Set(blips.map(({ quadrant }) => quadrant)));
  const rings = Array.from(new Set(blips.map(({ ring }) => ring)));

  return {
    props: { blips, quadrants, rings },
  };
};
export default Slug;
