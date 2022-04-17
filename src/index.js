const fs = require('fs')
const path = require('path')

const { ApolloServer, PubSub } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Link = require('./resolvers/Link')
const User = require('./resolvers/User')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Link,
  User,
  Vote,
}

const prisma = new PrismaClient()
const pubsub = new PubSub()
const { getUserId } = require('./utils')

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }
  },
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))
