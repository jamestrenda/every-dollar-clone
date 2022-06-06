import { ApolloClient, InMemoryCache } from '@apollo/client';
import { endpoint, prodEndpoint } from '../config';

export const client = new ApolloClient({
  uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
  cache: new InMemoryCache(),
});
