
module.exports = (onListening) => {
  const express = require('express')
  const { graphqlHTTP } = require('express-graphql')
  const { buildSchema } = require('graphql')

  const schema = buildSchema(`
    type Query {
        prop: String
        widgets(id: ID): [Widget!]!
    }

    type Widget {
        id: ID
        int: Int
        name: String!
    }
    `)

  const root = {
    prop: () => {
      return 'Hello world!'
    },
    widgets: ({ id }) =>
      widgets.filter(w => !id || id === w.id)

  }

  const widgets = [
    { id: '1', int: 1, name: 'one' },
    { id: '2', int: 2, name: 'two' }
  ]

  const app = express()

  app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  }))

  app.listen(4892, onListening)
}
