
module.exports = async (onListening) => {
  const express = require('express')
  const bodyParser = require('body-parser')
  const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server-express')
  const { createServer } = require('http')
  const { execute, subscribe } = require('graphql')
  const { PubSub } = require('graphql-subscriptions')
  const { WebSocketServer } = require('ws');
  const { useServer } =  require("graphql-ws/lib/use/ws");
  const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");

  const typeDefs = gql(`
  type Subscription {
    postAdded: Post!
  }

  type Query {
    posts: [Post!]!
  }

  type Mutation {
    addPost(author: String, comment: String): Post
  }

  type Post {
    author: String!
    comment: String!
  }
`)
  const PORT = 4892
  const app = express()

  app.use('/graphql', bodyParser.json())
  const POST_ADDED = 'POST_ADDED'
  const pubsub = new PubSub()

  const resolvers = {
    Subscription: {
      postAdded: {
        // Additional event labels can be passed to asyncIterator creation
        subscribe: (args) => {
          return pubsub.asyncIterator([POST_ADDED])
        }
      }
    },
    Query: {
      posts (root, args, context) {
        return posts
      }
    },
    Mutation: {
      addPost (root, args, context) {
        pubsub.publish(POST_ADDED, { postAdded: args })
        posts.push(args)
        return args
      }
    }
  }


  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql"
  });

  const serverCleanup = useServer({ schema, onMessage: (s) => console.log(s) }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(PORT, () => {
    onListening(server, server, PORT)
  });
}

const posts =
  [ { author: 'author 1', comment: 'comment 1' },
    { author: 'author 2', comment: 'comment 2' }
  ]
