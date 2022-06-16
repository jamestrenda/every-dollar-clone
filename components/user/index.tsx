import { useQuery, gql } from '@apollo/client';

const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY($id: Int!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      emailVerified
      isAdmin
      onboarded
      createdAt
      updatedAt
      role
    }
  }
`;
function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY);

  // return user;
  return data?.user;
}

export { CURRENT_USER_QUERY, useUser };
