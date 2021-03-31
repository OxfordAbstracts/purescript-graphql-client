
module.exports = (onListening) => {
  const express = require('express')
  const bodyParser = require('body-parser')
  const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server-express')
  const { createServer } = require('http')
  const { execute, subscribe } = require('graphql')
  const { PubSub } = require('graphql-subscriptions')
  const { SubscriptionServer } = require('subscriptions-transport-ws')
  // const { myGraphQLSchema } = require('./my-schema')
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
  const PORT = 4000
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

  const apolloServer = new ApolloServer({ schema })
  apolloServer.applyMiddleware({ app })

  const server = createServer(app)

  server.listen(PORT, () => {
    new SubscriptionServer({
      execute,
      subscribe,
      schema,
      resolvers
    }, {
      server: server,
      path: '/subscriptions'
    })

    setTimeout(() => onListening(server, apolloServer, PORT), 500)
  })
}

const posts =
  [{ author: 'author 1', comment: 'comment 1' },
    { author: 'author 2', comment: 'comment 2' }
  ]
