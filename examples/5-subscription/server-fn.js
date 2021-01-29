
module.exports = (onListening) => {
  const { buildSchema } = require('graphql')
  //   // Construct a schema, using GraphQL schema language
  const schema = buildSchema(`
  type Query {
    hello: String
  }
  type Subscription {
    greetings: String
  }
`)
  const express = require('express')
  const bodyParser = require('body-parser')
  const { ApolloServer, gql } = require('apollo-server-express')
  const { createServer } = require('http')
  const { execute, subscribe } = require('graphql')
  const { PubSub } = require('graphql-subscriptions')
  const { SubscriptionServer } = require('subscriptions-transport-ws')
  // const { myGraphQLSchema } = require('./my-schema')

  const PORT = 4000
  const app = express()

  app.use('/graphql', bodyParser.json())

  const apolloServer = new ApolloServer({ schema })
  apolloServer.applyMiddleware({ app })

  const pubsub = new PubSub()
  const server = createServer(app)

  server.listen(PORT, () => {
    new SubscriptionServer({
      execute,
      subscribe,
      schema
    }, {
      server: server,
      path: '/subscriptions'
    })

    setTimeout(onListening, 500)
  })
}
