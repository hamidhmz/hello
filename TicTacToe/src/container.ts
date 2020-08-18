import { createContainer, asFunction, asValue } from 'awilix';
import { importSchema } from 'graphql-import';

import * as resolvers from './api/graphql/resolvers';
import server from './api/graphql/server';
import { game, user } from './api/graphql/store';

const schema = importSchema('./src/api/graphql/schema/schema.graphql');

const container = createContainer();

// System
container
  .register({
    server: asFunction(server).singleton(),
  })
  .register({
    resolvers: asValue(resolvers),
    schema: asValue(schema),
    game: asValue(game),
    user: asValue(user),
  });

export default container;
