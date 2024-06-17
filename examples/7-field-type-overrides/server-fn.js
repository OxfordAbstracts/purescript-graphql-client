
module.exports = (onListening) => {
  const express = require('express')
  const { graphqlHTTP } = require('express-graphql')
  const { buildSchema } = require('graphql')

  const schema = buildSchema(`
    type Query {
        widgets(id: ID): [Widget!]!
    }

    type Widget {
        id: ID
        special_string: String!
    }
    `)

  const root = {
    widgets: () => widgets

  }

  const widgets = [
    { id: '1', int: 1, special_string: 'one' },
    { id: '2', int: 2, special_string: 'two' }
  ]

  const app = express()

  app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  }))

  app.listen(4892, onListening)
}
