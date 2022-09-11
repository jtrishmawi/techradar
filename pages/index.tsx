import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";

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
  const { data, loading, error } = useQuery(AllRadarsQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  return <pre>{JSON.stringify(data.radars, null, 2)}</pre>;
};

export default Home;
