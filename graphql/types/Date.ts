import { scalarType } from 'nexus';

export const DateScalar = scalarType({
  name: 'DateTime',
  asNexusMethod: 'dateTime',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value);
  },
});
