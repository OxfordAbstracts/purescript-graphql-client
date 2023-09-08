
module.exports = (onListening) => {
  const express = require('express')
  const { graphqlHTTP } = require('express-graphql')
  const { buildSchema } = require('graphql')

  const schema = buildSchema(`
    type Query {
        prop: String
        widgets(colour: Colour, ids: [Int!]): [Widget!]!
    }

    type Widget {
        id: Int
        name: String!
        colour: Colour!
    }
    "colour description"
    enum Colour {
      RED
      GREEN
      BLUE
      yellow
    }

    `)

  const root = {
    prop: () => {
      return 'Hello world!'
    },
    widgets: ({ colour, ids }) =>
      widgets
        .filter(w => !colour || colour === w.colour)
        .filter(w => !ids || ids.includes(w.id))

  }

  const widgets = [
    { id: 1, name: 'one', colour: 'RED' },
    { id: 2, name: 'two', colour: 'GREEN' },
    { id: 3, name: 'three', colour: 'GREEN' }
  ]

  const app = express()

  app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  }))

  app.listen(4000, onListening)
}
