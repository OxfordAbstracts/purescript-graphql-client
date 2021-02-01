
module.exports = (onListening) => {
  const { buildSchema } = require('graphql')
  //   // Construct a schema, using GraphQL schema language
  const schema = buildSchema(`
  type Subscription {
    postAdded: Post
  }

  type Query {
    posts: [Post]
  }

  type Mutation {
    addPost(author: String, comment: String): Post
  }

  type Post {
    author: String
    comment: String
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

  const POST_ADDED = 'POST_ADDED';
  const resolvers = {
    Subscription: {
      postAdded: {
        // Additional event labels can be passed to asyncIterator creation
        subscribe: () => pubsub.asyncIterator([POST_ADDED]),
      },
    },
    Query: {
      posts(root, args, context) {
        return postController.posts();
      },
    },
    Mutation: {
      addPost(root, args, context) {
        pubsub.publish(POST_ADDED, { postAdded: args });
        return postController.addPost(args);
      },
    },
  };

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
