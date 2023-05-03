import prisma from '../../lib/prisma';
import { builder } from '../builder';

// Input for the addSubscriber mutation
export const CreateSubscriberInput = builder.inputType('CreateSubscriberInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    language: t.string({ required: true }),
    country: t.string({ required: true }),
  })
});

builder.prismaObject('Subscriber', {
  name: 'Subscriber',
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    country: t.exposeString('country'),
    language: t.exposeString('language'),
    createdAt: t.expose('createdAt', { type: 'Date'}),
    updatedAt: t.expose('updatedAt', { type: 'Date'}),
  }),
})

builder.queryField('subscribers', (t) =>
  t.prismaField({
    type: ['Subscriber'],
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.subscriber.findMany({ ...query }),
  })
)

// addSubscriber mutation
builder.mutationField('addSubscriber', (t) => 
  t.prismaField({
    // return an object of type Subscriber
    errors: {
      types: [Error]
    },
    type: 'Subscriber',
    // arguments of the mutation
    args: {
      input: t.arg({
        type: CreateSubscriberInput,
        required: true 
      })
    },
    // resolver for the mutation. creates a subscriber in database
    resolve: async (query, _parent, _args, _ctx, _info) => {
      try {
        const data = await prisma.subscriber.create({ data: {
         ..._args.input,
         createdAt: new Date(),
         updatedAt: new Date(), 
        }});
        return data;
      } catch (err) {
        let errMessage = "";
        if (err?.message?.indexOf("Unique constraint failed on the fields: (`email`)") > -1) {
          errMessage = "Email should be unique";
        }
        throw new Error(errMessage || err?.message || "Unknown error");
      }
    }
  })
);