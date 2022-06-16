import { objectType } from 'nexus';

export const Message = objectType({
  name: 'Message',
  definition(t) {
    t.string('message');
    t.boolean('error');
  },
});
