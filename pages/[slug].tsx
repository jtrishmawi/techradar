import { gql } from "@apollo/client";
import { Blip, Radar } from "@prisma/client";
import { apolloClient } from "lib/apollo";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

type Param = { params: { slug: string } };

type Props = { blips: Blip[] };

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

const Slug: NextPage<Props> = ({ blips }) => {
  return <pre>{JSON.stringify(blips, null, 2)}</pre>;
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
  const { data } = await apolloClient.query({
    query: AllBlipsQuery,
    variables: { slug: params?.slug },
  });

  return {
    props: { blips: data.radar_with_blips }, // will be passed to the page component as props
  };
};
export default Slug;
