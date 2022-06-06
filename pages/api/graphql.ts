import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import { schema } from '../../graphql/schema';
import { createContext } from '../../graphql/context';

// configured via this tutorial: https://youtu.be/RJpevpbC4YY

const cors = Cors();
const apolloServer = new ApolloServer({
  schema,
  context: createContext,
});

const startServer = apolloServer.start();

export default cors(async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;

  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
});

// NextJs-specific
export const config = {
  api: {
    bodyParser: false,
  },
};
