import { gql, useQuery } from "@apollo/client";
import { Radar } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";

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

const Home: NextPage = () => {
  const { data, loading, error } = useQuery<{ radars: Radar[] }>(
    AllRadarsQuery
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  return (
    <ul>
      {data?.radars.map((radar) => (
        <li key={radar.id}>
          <Link href={radar.slug}>{radar.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Home;
