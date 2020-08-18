import { ApolloServer } from 'apollo-server';

import container from './src/container';

const server: ApolloServer = container.resolve('server');

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
