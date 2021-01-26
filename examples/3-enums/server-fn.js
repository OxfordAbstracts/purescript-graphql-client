
module.exports = (onListening) => {
  const express = require('express')
  const { graphqlHTTP } = require('express-graphql')
  const { buildSchema } = require('graphql')

  const schema = buildSchema(`
    type Query {
        prop: String
        widgets(colour: Colour): [Widget!]!
    }

    type Widget {
        id: Int
        name: String!
        colour: Colour!
    }

    enum Colour {
      RED
      GREEN
      BLUE
    }

    `)

  const root = {
    prop: () => {
      return 'Hello world!'
    },
    widgets: ({ colour }) =>
      widgets.filter(w => !colour || colour === w.colour)

  }

  const widgets = [
    { id: 1, name: 'one', colour: 'RED' },
    { id: 2, name: 'two', colour: 'GREEN' }
  ]

  const app = express()

  app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  }))

  app.listen(4000, onListening)
}
