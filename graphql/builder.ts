import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import RelayPlugin from '@pothos/plugin-relay'
import { GraphQLScalarType, Kind } from 'graphql'
import prisma from '../lib/prisma'

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  scalars: {
    Date: {
      Input: Date
      Output: Date
    }
  }
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relayOptions: {},
  prisma: {
    client: prisma,
  },
})

const DateResolver = new GraphQLScalarType({
  name: 'Date',
  description: 'A date scalar that represents a date in ISO format',
  parseValue(value) {
    return new Date(value); // Convert the input value to a Date object
  },
  serialize(value) {
    return value.toISOString(); // Convert the Date object to an ISO string format
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // Convert the string value to a Date object
    }
    return null;
  },
})

builder.addScalarType('Date', DateResolver, {})

builder.queryType({
  fields: (t) => ({
    ok: t.boolean({
      resolve: () => true,
    }),
  }),
})

builder.mutationType({});