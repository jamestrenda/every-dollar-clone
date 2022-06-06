import { makeSchema, connectionPlugin, scalarType } from 'nexus';
import { join } from 'path';
import * as types from './types';

const DateScalar = scalarType({
  name: 'DateTime',
  asNexusMethod: 'dateTime',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value);
  },
});

export const schema = makeSchema({
  types: { types, DateScalar },
  plugins: [connectionPlugin()],
  outputs: {
    typegen: join(
      process.cwd(),
      'node_modules',
      '@types',
      'nexus-typegen',
      'index.d.ts'
    ),
    schema: join(process.cwd(), 'graphql', 'schema.graphql'),
  },
  contextType: {
    export: 'Context',
    module: join(process.cwd(), 'graphql', 'context.ts'),
  },
});
