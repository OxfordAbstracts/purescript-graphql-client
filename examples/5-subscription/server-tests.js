


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
    console.info('server 1')
    // The roots provide resolvers for each GraphQL operation
    const roots = {
      query: {
        hello: () => 'Hello World!'
      },
      subscription: {
        greetings: async function * sayHiIn5Languages () {
          for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo']) {
            yield { greetings: hi }
          }
        }
      }
    }
  
    const https = require('https')
    const ws = require('ws')
    const { useServer } = require('graphql-ws/lib/use/ws')
    const { execute, subscribe } = require('graphql')
    console.info('server 2')
  
    const server = https.createServer(function weServeSocketsOnly (_, res) {
      res.writeHead(404)
      res.end()
    })
  
    const wsServer = new ws.Server({
      server,
      path: '/graphql'
    })
  
    useServer(
      {
        schema, // from the previous step
        roots, // from the previous step
        execute,
        subscribe
      },
      wsServer
    )
    console.info('server 3')
  
    server.listen(4000, onListening)
  
    // const { createServer } = require('http')
    // const { SubscriptionServer } = require('subscriptions-transport-ws')
    // const { execute, subscribe } = require('graphql')
  
    // const WS_PORT = 5000
  
    // // Create WebSocket listener server
    // const websocketServer = createServer((request, response) => {
    //   response.writeHead(404)
    //   response.end()
    // })
  
    // // Bind it to port and start listening
    // websocketServer.listen(WS_PORT, () => console.log(
    // `Websocket Server is now running on http://localhost:${WS_PORT}`
    // ))
  
    // const subscriptionServer = SubscriptionServer.create(
    //   {
    //     schema,
    //     execute,
    //     subscribe
    //   },
    //   {
    //     server: websocketServer,
    //     path: '/graphql'
    //   }
    // )
    // const express = require('express')
    // const bodyParser = require('body-parser')
    // const { ApolloServer, gql } = require('apollo-server-express')
    // const { createServer } = require('http')
    // const { execute, subscribe } = require('graphql')
    // const { PubSub } = require('graphql-subscriptions')
    // const { SubscriptionServer } = require('subscriptions-transport-ws')
    // // const { myGraphQLSchema } = require('./my-schema')
  
    // const PORT = 4000
    // const app = express()
  
    // app.use('/graphql', bodyParser.json())
  
    // const apolloServer = new ApolloServer({ schema })
    // apolloServer.applyMiddleware({ app })
  
    // const pubsub = new PubSub()
    // const server = createServer(app)
  
    // server.listen(PORT, () => {
    //   new SubscriptionServer({
    //     execute,
    //     subscribe,
    //     schema
    //   }, {
    //     server: server,
    //     path: '/subscriptions'
    //   })
  
    //   setTimeout(onListening, 500)
    // })
  
    // const express = require('express')
    // // const {
    // //   graphqlExpress,
    // //   graphiqlExpress
    // // } = require('apollo-server-express')
    // const bodyParser = require('body-parser')
    // const cors = require('cors')
    // const { execute, subscribe } = require('graphql')
    // const { createServer } = require('http')
    // const { SubscriptionServer } = require('subscriptions-transport-ws')
  
    // const PORT = 3000
    // const server = express()
  
    // server.use('*', cors({ origin: `http://localhost:${PORT}` }))
  
    // server.use('/graphql', bodyParser.json(), graphqlExpress({
    //   schema
    // }))
  
    // server.use('/graphiql', graphiqlExpress({
    //   endpointURL: '/graphql',
    //   subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
    // }))
  
    // // Wrap the Express server
    // const ws = createServer(server)
    // ws.listen(PORT, () => {
    //   console.log(`Apollo Server is now running on http://localhost:${PORT}`)
    //   // Set up the WebSocket for handling GraphQL subscriptions
    //   new SubscriptionServer({
    //     execute,
    //     subscribe,
    //     schema
    //   }, {
    //     server: ws,
    //     path: '/subscriptions'
    //   })
  
    //   setTimeout(onListening, 500)
    // })
    // const express = require('express')
    // const { graphqlHTTP } = require('express-graphql')
  
    // // const typeDefs = require('./schema');
    // // const resolvers = require('./resolvers');
    // // const { makeExecutableSchema } = require('graphql-tools')
    // // const schema = makeExecutableSchema({
    // //   typeDefs: typeDefs,
    // //   resolvers: resolvers
    // // })
  
    // const { execute, subscribe } = require('graphql')
    // const { createServer } = require('http')
    // const { SubscriptionServer } = require('subscriptions-transport-ws')
  
    // const PORT = 4000
  
    // var app = express()
  
    // app.use(
    //   '/graphql',
    //   graphqlHTTP({
    //     schema: schema,
    //     graphiql: { subscriptionEndpoint: `ws://localhost:${PORT}/subscriptions` }
    //   })
    // )
  
    // const ws = createServer(app)
  
    // ws.listen(PORT, () => {
    // // Set up the WebSocket for handling GraphQL subscriptions.
    //   new SubscriptionServer(
    //     {
    //       execute,
    //       subscribe,
    //       schema
    //     },
    //     {
    //       server: ws,
    //       path: '/subscriptions'
    //     }
    //   )
    //   setTimeout(onListening, 500)
    // })
  }
  