import { ApolloServer, PubSub } from 'apollo-server';
import { importSchema } from 'graphql-import';

function server({ schema, resolvers, game, user }) {
  const typeDefs = importSchema(schema);

  const pubsub = new PubSub();

  return new ApolloServer({
    typeDefs,
    resolvers,
    context: { pubsub, game, user },
  });
}

export default server;
